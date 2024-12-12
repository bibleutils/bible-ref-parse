import * as fs from 'fs';
import { execSync } from 'child_process';
import { argv } from 'process';
import logger from './utils/logger';
import { NON_LATIN_DIGITS_REGEXPS, SPACE_REGEXP, REGEXP_CHARACTERS, ALL_NON_LATIN_DIGITS_REGEXP } from './regexps';
import { CONFIG } from './config';
import { COMMANDS } from './commands';
import { fileOrDirectoryExists, prepareDirectory } from './utils/utils';
import {
	IAssertionData,
	IBook,
	IBookAssertionsData,
	IData,
	IInputDataVariables,
	ITestsData,
	Ref,
	Variable,
} from './types';
import { makeSpecTemplate } from './templates/spec.template';

// GLOBAL VARIABLES
const lang = CONFIG.language;
let gValidCharacters = "[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014]";
const gValidOsises = makeValidOsises([
	'Gen', 'Exod', 'Lev', 'Num', 'Deut', 'Josh', 'Judg', 'Ruth', '1Sam', '2Sam', '1Kgs', '2Kgs', '1Chr', '2Chr', 'Ezra', 'Neh', 'Esth',
	'Job', 'Ps', 'Prov', 'Eccl', 'Song', 'Isa', 'Jer', 'Lam', 'Ezek', 'Dan', 'Hos', 'Joel', 'Amos', 'Obad', 'Jonah', 'Mic', 'Nah', 'Hab', 'Zeph',
	'Hag', 'Zech', 'Mal', 'Matt', 'Mark', 'Luke', 'John', 'Acts', 'Rom', '1Cor', '2Cor', 'Gal', 'Eph', 'Phil', 'Col', '1Thess', '2Thess',
	'1Tim', '2Tim', 'Titus', 'Phlm', 'Heb', 'Jas', '1Pet', '2Pet', '1John', '2John', '3John', 'Jude', 'Rev', 'Tob', 'Jdt', 'GkEsth', 'Wis',
	'Sir', 'Bar', 'PrAzar', 'Sus', 'Bel', 'SgThree', 'EpJer', '1Macc', '2Macc', '3Macc', '4Macc', '1Esd', '2Esd', 'PrMan', 'AddEsth', 'AddDan',
]);

// PROGRAM STARTS HERE
logger.info(`${argv[1]} Starting...`);

const GLOBAL_RAW_ABBREVS: any = {};
// logger.info("Global 'gRawAbbrevs' Variable Value: ", gRawAbbrevs);
const fileName: string = CONFIG.paths.src.dataFile;
if (!fileOrDirectoryExists(fileName)) {
	logger.info(`Current Working Dir: ${__dirname}`);
	logger.error(`Can't open ${fileName}. Make sure it is present.`);
	process.exit(1);
}

const fileContent: IData = prepareData(
	fs.readFileSync(fileName, { encoding: 'utf-8', flag: 'r' })
);
const GLOBAL_VARIABLES = getVars(fileContent.variables);
const COLLAPSE_COMBINING_CHARACTERS = !(GLOBAL_VARIABLES[Variable.COLLAPSE_COMBINING_CHARACTERS] && GLOBAL_VARIABLES[Variable.COLLAPSE_COMBINING_CHARACTERS][0] === 'false');
const FORCE_OSIS_ABBREV = !(GLOBAL_VARIABLES[Variable.FORCE_OSIS_ABBREV] && GLOBAL_VARIABLES[Variable.FORCE_OSIS_ABBREV][0] === 'false');
// logger.info("Global 'gVars' Variable Value: ", gVars);
const GLOBAL_ABBREVS: any = getAbbrevs(fileContent.books, fileContent.preferredBookNames);
// logger.info("Global 'gAbbrevs' Variable Value: ", gAbbrevs);
const GLOBAL_ORDER = getOrder(fileContent.order);
prepareDirectory(CONFIG.paths.build.directory);
// logger.info("Global 'gOrder' Variable Value: ", gOrder);
const gAllAbbrevs = makeTests();
logger.info("Make Regular Expressions...");
// Every global variable is matching till this point
makeRegexps();
logger.info("Make Grammar...");
makeGrammar();
const defaultAlternatesFile = CONFIG.paths.template.translationAlternates;
logger.info("Make Translations...");
makeTranslations();

// PROGRAM ENDS HERE

// FUNCTION DECLARATIONS
function escapeRegExp(pattern: string) {
	return pattern.replace(REGEXP_CHARACTERS, '\\$&');
}

function getVars(variables: Partial<IInputDataVariables>): Partial<IInputDataVariables> {
	const out = { ...variables};

	if (out[Variable.ALLOWED_CHARACTERS]) {
		for (const char of out[Variable.ALLOWED_CHARACTERS]) {
			const check = escapeRegExp(char);
			if (!gValidCharacters.includes(check)) {
				gValidCharacters += char;
			}
		}
	}

	const letters = getPreBookCharacters(out[Variable.UNICODE_BLOCK]);
	if (!out[Variable.PRE_BOOK_ALLOWED_CHARACTERS])
		out[Variable.PRE_BOOK_ALLOWED_CHARACTERS] = [letters];
	if (!out[Variable.POST_BOOK_ALLOWED_CHARACTERS])
		out[Variable.POST_BOOK_ALLOWED_CHARACTERS] = [gValidCharacters];
	if (!out[Variable.PRE_PASSAGE_ALLOWED_CHARACTERS])
		out[Variable.PRE_PASSAGE_ALLOWED_CHARACTERS] = [getPrePassageCharacters(out[Variable.PRE_BOOK_ALLOWED_CHARACTERS])];
	out[Variable.LANG] = [lang];
	if (!out[Variable.LANG_ISOS])
		out[Variable.LANG_ISOS] = [lang];

	return out;
}

function getOrder(order: string[]): Ref[] {
	let out = [];
	for (const osis of fileContent.order) {
		isValidOsis(osis);
		const apocrypha = gValidOsises[osis] === 'apocrypha';
		out.push({ osis, apocrypha });
		GLOBAL_ABBREVS[osis] = GLOBAL_ABBREVS[osis] || {};
		GLOBAL_ABBREVS[osis][osis] = true;
		GLOBAL_RAW_ABBREVS[osis] = GLOBAL_RAW_ABBREVS[osis] || {};
		GLOBAL_RAW_ABBREVS[osis][osis] = true;
	}
	return out;
}

function isValidOsis(osis: string): void {
	for (const part of osis.split(',')) {
		if (!gValidOsises.hasOwnProperty(part)) {
			throw new Error(`Invalid OSIS: ${osis} (${part})`);
		}
	}
}

function makeTests(): { [key: string]: string[] } {
	let out: string[] = [];
	let osises = [...GLOBAL_ORDER];
	let allAbbrevsInMakeTests = {};

	// Append any OSIS with a comma
	Object.keys(GLOBAL_ABBREVS).toSorted().forEach(osis => {
		if (osis.includes(',')) {
			osises.push({ osis, apocrypha: false });
		}
	});

	let testsData: ITestsData = {
		lang,
		assertions: {
			book: [],
			ranges: [],
			chapters: [],
			verses: [],
			sequence: [],
			title: [],
			ff: [],
			next: [],
			trans: [],
			bookRange: [],
			boundary: [],
		},
	};

	osises.forEach(ref => {
		const osis = ref.osis;
		let tests: string[] = [];
		const [first] = osis.split(',');
		const match = `${first}.1.1`;

		// Process each abbreviation for the current OSIS
		const bookAssertionsData: IBookAssertionsData = {
			osis,
			hasNonLatinDigits: false,
			assertions: [],
			nonApocryphalAssertions: [],
		}
		sortAbbrevsByLength(Object.keys(GLOBAL_ABBREVS[osis])).forEach(abbrev => {
			expandAbbrevVars(abbrev).toSorted().forEach(expanded => {
				allAbbrevsInMakeTests = addAbbrevToAllAbbrevs(osis, expanded, allAbbrevsInMakeTests);
				bookAssertionsData.assertions.push({ input: `"${expanded} 1:1"`, expected: `"${match}"` });
				tests.push(`\t\texpect(p.parse("${expanded} 1:1").osis()).toEqual("${match}", "parsing: '${expanded} 1:1'")`);
			});

			// Handle alternate OSIS abbreviations
			osises.forEach(({ osis: altOsis}) => {
				if (osis === altOsis) return;

				if (!GLOBAL_ABBREVS.hasOwnProperty(altOsis)) return;
				Object.keys(GLOBAL_ABBREVS[altOsis]).forEach(altAbbrev => {
					// for(let altAbbrev of Object.keys(gAbbrevs[altOsis])) {
					// if (altAbbrev.length < abbrev.length) continue;
					if (altAbbrev.length < abbrev.length) return;

					const qAbbrev = RegExp(`\\b${escapeRegExp(abbrev)}\\b`);
					if (qAbbrev.test(altAbbrev)) {
						osises.forEach(checkRef => {
							// for(let checkRef of osises) {
							// if (altOsis === checkRef.osis) break; // We found the correct order.
							if (altOsis === checkRef.osis) return; // We found the correct order.
							if (osis === checkRef.osis) {
								logger.info(`${altOsis} should be before ${osis} in parsing order\n  ${altAbbrev} matches ${abbrev}`);
							}
						});
					}
				});
			});
		});

		bookAssertionsData.hasNonLatinDigits = stringHasNonLatinDigits(tests.join("\n"));

		// Add valid non-apocryphal OSIS tests
		if (gValidOsises[first] !== 'apocrypha') {
			out.push("\t\tp.include_apocrypha(false)");
			sortAbbrevsByLength(Object.keys(GLOBAL_ABBREVS[osis])).forEach(abbrev => {
				expandAbbrevVars(abbrev).forEach(expanded => {
					const normalized = ucNormalize(expanded);
					bookAssertionsData.nonApocryphalAssertions.push({ input: `"${normalized} 1:1"`, expected: `"${match}"` });
				});
			});
		}

		testsData.assertions.book.push(bookAssertionsData);
	});

	// Write the book names to a file
	let allabbrevs_sorted = Object.keys(allAbbrevsInMakeTests).toSorted();
	let bookNamesFile = '';

	for (let osis of allabbrevs_sorted) {
		const osisAbbrevs = sortAbbrevsByLength(Object.keys(allAbbrevsInMakeTests[osis]));
		const useOsis = osis.replace(/,+$/, ''); // Remove trailing commas
		for (const abbrev of osisAbbrevs) {
			const use = abbrev.replace(/\u2009/ug, ' '); // Replace a thin space with a regular space
			bookNamesFile += `${useOsis}\t${use}\n`;
		}
		allAbbrevsInMakeTests[osis] = osisAbbrevs;
	}
	fs.writeFileSync(CONFIG.paths.build.bookNames, bookNamesFile);

	testsData.assertions.ranges.push(...addRangeTests());
	testsData.assertions.chapters.push(...addChapterTests());
	testsData.assertions.verses.push(...addVerseTests());
	testsData.assertions.sequence.push(...addSequenceTests());
	testsData.assertions.title.push(...addTitleTests());
	testsData.assertions.ff.push(...addFfTests());
	testsData.assertions.next.push(...addNextTests());
	testsData.assertions.trans.push(...addTransTests());
	testsData.assertions.bookRange.push(...addBookRangeTests());
	testsData.assertions.boundary.push(...addBoundaryTests());

	// Replace placeholders in the spec template
	const langIsos = JSON.stringify(GLOBAL_VARIABLES[Variable.LANG_ISOS]);

	let template = getFileContents(CONFIG.paths.template.spec);
	template = template.replace(/\$LANG_ISOS/g, langIsos);
	template = template.replace(/\$LANG/g, lang);
	const { bookTests, miscTests } = makeSpecTemplate(testsData);
	template = template.replace(/\$BOOK_TESTS/, bookTests);
	template = template.replace(/\$MISC_TESTS/, miscTests);
	fs.writeFileSync(CONFIG.paths.build.spec, template, { encoding: 'utf-8' });

	return allAbbrevsInMakeTests;
}

function makeRegexps() {
	let out = getFileContents(CONFIG.paths.template.regexps);

	if (!GLOBAL_VARIABLES['$NEXT']) {
		out = out.replace(/\n.+\$NEXT.+\n/, '\n');
		if (/\$NEXT\b/.test(out)) {
			throw new Error('Regexps: next');
		}
	}

	const osises = GLOBAL_ORDER.slice();
	const sortedRawAbbrevs = Object.keys(GLOBAL_RAW_ABBREVS).sort();
	sortedRawAbbrevs.forEach(osis => {
		if (!osis.includes(',')) return;
		if (osis.charAt(osis.length - 1) === ',') {
			logger.error('OSIS - WITH TRAILING COMMA', osis);
		}
		let temp = osis.replace(/,+$/, '');	// Replace last comma
		const apocrypha = gValidOsises[temp] && gValidOsises[temp] === 'apocrypha';
		osises.push({ osis, apocrypha });
	});

	const bookRegexps = makeRegexpSet(osises);
	out = out.replace(/\$BOOK_REGEXPS/, bookRegexps);
	out = out.replace(/\$VALID_CHARACTERS/, gValidCharacters);

	const prePassageAllowedCharacters = GLOBAL_VARIABLES[Variable.PRE_PASSAGE_ALLOWED_CHARACTERS].join('|');
	out = out.replace(/\$PRE_PASSAGE_ALLOWED_CHARACTERS/g, prePassageAllowedCharacters);

	const preBookAllowedCharacters = GLOBAL_VARIABLES[Variable.PRE_BOOK_ALLOWED_CHARACTERS].map((value: string) => formatValue('quote', value)).join('|');
	out = out.replace(Variable.PRE_BOOK_ALLOWED_CHARACTERS, preBookAllowedCharacters);

	const passageComponents: string[] = [];
	for (const varName of [Variable.CHAPTER, Variable.NEXT, Variable.FF, Variable.TO, Variable.AND, Variable.VERSE]) {
		if (GLOBAL_VARIABLES[varName]) {
			passageComponents.push(...GLOBAL_VARIABLES[varName].map((value: any) => formatValue('regexp', value)));
		}
	}

	passageComponents.sort((a, b) => b.length - a.length);
	out = out.replace(/\$PASSAGE_COMPONENTS/g, passageComponents.join(' | '));

	Object.keys(GLOBAL_VARIABLES).sort().forEach((key) => {
		const safeKey = key.replace(/^\$/, '\\$');
		const regex = RegExp(`${safeKey}(?!\\w)`, 'g');
		out = out.replace(regex, formatVar('regexp', key));
	});

	fs.writeFileSync(CONFIG.paths.build.regexps, out, { encoding: 'utf-8' });

	const match = out.match(/\$[A-Z_]+/);
	if (match) {
		throw new Error(`${match[0]}\nRegexps: Capital variable`);
	}
}

function makeRegexpSet(refs: Ref[]): string {
	const out = [];
	let hasPsalmCb = false;

	for (const ref of refs) {
		const { osis, apocrypha } = ref;
		if (osis === 'Ps' && !hasPsalmCb && fileOrDirectoryExists(CONFIG.paths.src.psalms)) {
			out.push(getFileContents(CONFIG.paths.src.psalms));
			hasPsalmCb = true;
		}

		const safes: { [abbrev: string]: number } = {};
		for (const abbrev of Object.keys(GLOBAL_RAW_ABBREVS[osis])) {
			let safe = abbrev.replace(/[\[\]\?]/g, '');
			safes[abbrev] = safe.length;
		}

		const sortedSafes = Object.keys(safes).sort((a, b) => b.length - a.length);
		out.push(makeRegexp(osis, apocrypha, sortedSafes));
	}

	return out.join("\u000A\t,\u000A");
}

function getFileContents(filePath: string): string {
	try {
		return fs.readFileSync(filePath, { encoding: 'utf-8' });
	} catch (error: any) {
		throw new Error(`Couldn't open ${filePath}: ${error.message}`);
	}
}

function makeRegexp(osis: string, apocrypha: boolean, sortedSafes: string[]): string {
	const out: string[] = [];
	const abbrevList: string[] = [];

	for (let abbrev of sortedSafes) {
		abbrev = abbrev.replace(/ /g, `${SPACE_REGEXP}*`);
		abbrev = abbrev.replace(/[\u200B]/g, () => {
			let temp = SPACE_REGEXP;
			// Replace the closing bracket ']' at the end of 'temp' with \u200B followed by ']'
			temp = temp.replace(/\]$/, '\u200B]');
			return `${temp}*`;
		});
		abbrev = handleAccents(abbrev);
		abbrev = abbrev.replace(/(\$[A-Z]+)(?!\w)/g, (match) => formatVar('regexp', match) + "\\.?");
		abbrevList.push(abbrev);
	}

	const bookRegexp = makeBookRegexp(osis, gAllAbbrevs[osis].slice(), 1);
	osis = osis.replace(/,+$/, '');
	osis = osis.replace(/,/g, `", "`);
	out.push(`\t\tosis: ["${osis}"]\x0a\t\t`);
	if (apocrypha) out.push("apocrypha: true\x0a\t\t");
	let pre = '#{bcv_parser::regexps.pre_book}';
	if (/^[0-9]/.test(osis) || /[0-9]/.test(abbrevList.join('|'))) {
		pre = GLOBAL_VARIABLES[Variable.PRE_BOOK_ALLOWED_CHARACTERS].map((char: string) => formatValue('quote', char)).join('|');
		if (pre === "\\\\d|\\\\b") {
			pre = '\\b';
		}
		pre = pre.replace(/\\+d\|?/, '');
		pre = pre.replace(/^\|+/, '');
		pre = pre.replace(/^\||\|\||\|$/, ''); // remove leftover |
		pre = pre.replace(/^\[\^/, '[^0-9'); // if it's a negated class, add \d
	}

	const post = GLOBAL_VARIABLES[Variable.POST_BOOK_ALLOWED_CHARACTERS].join('|');
	out.push(`regexp: ///(^|${pre})(\x0a\t\t`);
	out.push(bookRegexp);
	out[out.length - 1] = out[out.length - 1].replace(/-(?!\?)/g, '-?');
	out.push(`\x0a\t\t\t)(?:(?=${post})|\$)///gi`);

	return out.join("");
}

function makeBookRegexp(osis: string, abbrevs: string[], recurseLevel: number) {
	// Remove backslashes from each abbreviation
	abbrevs = abbrevs.map(abbrev => abbrev.replace(/\\/g, ''));

	// Get subsets of the book abbreviations
	const subsets = getBookSubsets(abbrevs.slice());
	const out: string[] = [];
	let i = 1;

	for (const subset of subsets) {
		const json = JSON.stringify(subset);
		let base64 = Buffer.from(json).toString('base64');
		logger.info(`${osis} ${base64.length}`);

		let useFile = false;

		if (base64.length > 128_000 || base64.length > 8190) { // Ubuntu limitation & windows limitation on command line
			useFile = true;
			fs.writeFileSync('./temp.txt', json);
			base64 = '<';
		}

		let regexp = execSync(COMMANDS.makeRegexps(base64)).toString();

		if (useFile) {
			fs.unlinkSync('./temp.txt');
		}

		regexp = JSON.parse(regexp);
		if (!regexp['patterns']) {
			throw new Error("No regexp JSON object");
		}

		let patterns: string[] = [];
		for(let pattern of regexp['patterns']) {
			patterns.push(formatNodeRegexpPattern(`${pattern}`));
		}
		let pattern = patterns.join('|');
		pattern = validateNodeRegexp(osis, pattern, subset, recurseLevel);
		out.push(pattern);

	}

	validateFullNodeRegexp(osis, out.join('|'), abbrevs);
	return out.join('|');
}

function validateFullNodeRegexp(osis: string, pattern: string, abbrevs: string[]): void {
	abbrevs.forEach(abbrev => {
		let compare = `${abbrev} 1`;
		const regex = RegExp(`^(?:${pattern}) `);
		compare = compare.replace(regex, '');
		if (compare !== '1') {
			logger.error(`	Not parsable (${abbrev}): '${compare}'\n${pattern}`);
		}
	});
}

function getBookSubsets(abbrevs: string[]): string[][] {
	if (abbrevs.length <= 20) {
		return [abbrevs];
	}

	const groups: string[][] = [[]];
	const subs: { [key: string]: number } = {};

	// Sort abbreviations by length in descending order
	abbrevs = abbrevs.sort((a, b) => b.length - a.length);

	while (abbrevs.length > 0) {
		const long = abbrevs.shift();
		if (subs[long]) continue;

		for (let i = 0; i < abbrevs.length; i++) {
			const short = escapeRegExp(abbrevs[i]);
			// Direct usage of Unicode property escapes
			const punctuationPattern = `\\p{P}`;  // Matches punctuation characters
			const symbolPattern = `\\p{S}`;       // Matches symbol characters
			// Create the final pattern as in Perl
			// Construct the regular expression pattern
			const pat = `(?:^|[\\s${punctuationPattern}${symbolPattern}])${short}(?:[\\s${punctuationPattern}${symbolPattern}]|$)`;
			// If you want to use this pattern in a RegExp:
			const regex = RegExp(pat, 'ui');  // 'u' flag enables Unicode matching
			if (!regex.test(long)) continue;
			subs[abbrevs[i]] = (subs[abbrevs[i]] || 0) + 1;
		}
		groups[0].push(long);
	}

	if (Object.keys(subs).length > 0) {
		groups[1] = Object.keys(subs).sort((a, b) => b.length - a.length);
	}

	return groups;
}

function makeTranslations() {
	let out = getFileContents(CONFIG.paths.template.translations);
	const regexps: string[] = [];
	const aliases: string[] = [];

	for (const translation of GLOBAL_VARIABLES['$TRANS']) {
		const [trans, osis, alias] = translation.split(',');
		regexps.push(trans);

		if (osis || alias) {
			const effectiveAlias = alias || 'default';
			let lc = trans.toLowerCase();
			lc = /[\W]/.test(lc) ? `"${lc}"` : lc;

			let string = `${lc}:`;
			if (osis) {
				string += `\x0a\t\t\tosis: "${osis}"`;
			}
			if (effectiveAlias) {
				string += `\x0a\t\t\talias: "${effectiveAlias}"`;
			}
			aliases.push(string);
		}
	}

	const regexp = makeBookRegexp('translations', regexps.slice(), 1);
	let alias = aliases.join('\x0a\t\t');

	const translationAliasesPath = CONFIG.paths.build.translationAliases;
	if (fs.existsSync(translationAliasesPath)) {
		alias = getFileContents(translationAliasesPath);
		out = out.replace(/\t+(\$TRANS_ALIAS)/g, (match, group1) => group1);
	}

	let alternate = getFileContents(defaultAlternatesFile);
	const translationAlternatesPath = CONFIG.paths.build.translationAlternates;
	if (fs.existsSync(translationAlternatesPath)) {
		alternate = getFileContents(translationAlternatesPath);
	}

	out = out.replace(/\$TRANS_REGEXP/g, regexp);
	out = out.replace(/\$TRANS_ALIAS/g, alias);
	out = out.replace(/\s*\$TRANS_ALTERNATE/g, `\n${alternate}`);

	const langIsos = JSON.stringify(GLOBAL_VARIABLES[Variable.LANG_ISOS]);
	out = out.replace(/\$LANG_ISOS/g, langIsos);

	fs.writeFileSync(CONFIG.paths.build.translations, out, { encoding: 'utf-8' });

	if (/\$[A-Z_]+/.test(out)) {
		throw new Error('Translations: Capital variable');
	}
}

function makeGrammar() {
	let out = getFileContents(CONFIG.paths.template.grammar);

	if (!GLOBAL_VARIABLES['$NEXT']) {
		out = out.replace(/\nnext_v\s+=.+\s+\{ return[^\}]+\}\s+\}\s+/, '\n');
		out = out.replace(/\bnext_v \/ /g, '');
		out = out.replace(/\$NEXT \/ /g, '');
		if (/\bnext_v\b|\$NEXT/.test(out)) {
			throw new Error('Grammar: next_v');
		}
	}

	// Assuming vars is an object (hash in Perl)
	for (const key of Object.keys(GLOBAL_VARIABLES).sort()) {
		// Escape any leading '$' in the key
		const safeKey = key.replace(/^\$/, '\\$');

		// Perform a global replacement in the string `out` using a regex pattern
		const regex = new RegExp(`(${safeKey})\\b`, 'g');  // (?![\\w]) ensures no word character follows

		// Replace occurrences of the safeKey with the result of format_var('pegjs', key)
		out = out.replace(regex, formatVar('pegjs', key));
	}

	fs.writeFileSync(CONFIG.paths.build.grammar, out, { encoding: 'utf-8' });

	const match = out.match(/(\$[A-Z_]+)/);
	if (match) {
		throw new Error(`${match[0]}\nGrammar: Capital variable`);
	}
}

function consolidateAbbrevs(...refs: { [key: string]: any }[]): string[][] {
	const out: string[][] = [];
	let mergeIndex: number = -1;

	while (refs.length > 0) {
		const ref = refs.shift()!;
		if (Object.keys(ref).length === 2) {
			if (mergeIndex === -1) {
				mergeIndex = out.length;
				out.push(Object.keys(ref));
			} else {
				for (const abbrev of Object.keys(ref)) {
					out[mergeIndex].push(abbrev);
				}
				if (out[mergeIndex].length > 6) {
					mergeIndex = -1;
				}
			}
		} else {
			out.push(Object.keys(ref));
		}
	}

	return out;
}

// Most important function - We can easily mess up the regex matching. Be cautious while modifying it.
function validateNodeRegexp(
	osis: string,
	pattern: string,
	abbrevs: string[],
	recurseLevel: number,
	note?: string
): string {
	let okPattern: string, notOkPattern: string;
	let [oks, notOks] = checkRegexpPattern(osis, pattern, abbrevs);

	if (notOks.length === 0) {
		return pattern;
	}

	logger.info(`RECURSE_LEVEL: ${recurseLevel}`);
	if(osis === '2Sam' && recurseLevel == 2) {
		logger.info("Break");
	}

	if (recurseLevel > 10) {
		logger.info(`Splitting ${osis} by length...`);
		if (note === 'lengths') {
			throw new Error(`'Lengths' didn't work: ${osis}`);
		}

		const lengths = splitByLength(abbrevs);
		const patterns: string[] = [];

		for (const length of Object.keys(lengths).sort((a, b) => Number(b) - Number(a))) {
			patterns.push(makeBookRegexp(osis, lengths[length].slice(), 1));
		}

		return validateNodeRegexp(osis, patterns.join('|'), abbrevs, recurseLevel + 1, 'lengths');
	}

	logger.info(`	 Recurse (${osis}): ${recurseLevel}`);

	okPattern = makeBookRegexp(osis, oks.slice(), recurseLevel + 1);
	notOkPattern = makeBookRegexp(osis, notOks.slice(), recurseLevel + 1);

	// Find the shortest string values for current patterns
	const shortestOk = oks.toSorted((a, b) => a.length - b.length)[0];
	const shortestNotOk = notOks.toSorted((a, b) => a.length - b.length)[0];

	let newPattern = (shortestOk.length > shortestNotOk.length && recurseLevel < 10)
		? `${okPattern}|${notOkPattern}`
		: `${notOkPattern}|${okPattern}`;

	newPattern = validateNodeRegexp(osis, newPattern, abbrevs, recurseLevel + 1, 'final');
	return newPattern;
}

function splitByLength(abbrevs: string[]): { [key: number]: string[] } {
	const lengths: { [key: number]: string[] } = {};

	for (const abbrev of abbrevs) {
		const length = Math.floor(abbrev.length / 2);
		if (!lengths[length]) {
			lengths[length] = [];
		}
		lengths[length].push(abbrev);
	}

	return lengths;
}

function checkRegexpPattern(
	osis: string,
	pattern: string,
	abbrevs: string[]
): [string[], string[]] {
	const oks: string[] = [];
	const notOks: string[] = [];

	for (const abbrev of abbrevs) {
		if(abbrev === '2 Sm') {
			logger.info("Break-2");
		}
		let compare = `${abbrev} 1`;
		compare = compare.replace(RegExp(`^(?:${pattern})`, 'i'), '');
		if (compare !== ' 1') {
			notOks.push(abbrev);
		} else {
			oks.push(abbrev);
		}
	}

	return [oks, notOks];
}

function formatNodeRegexpPattern(pattern: string): string {
	if (!/^\/\^/.test(pattern) || !/\$\/$/.test(pattern)) {
		throw new Error(`Unexpected regexp pattern: ${pattern}`);
	}

	// Remove the leading "/^" and trailing "$/"
	pattern = pattern.replace(/^\/\^/, '').replace(/\$\/$/, '');

	// Handle the part with square brackets
	if (/\[/.test(pattern)) {
		const parts = pattern.split('[');
		const out: string[] = [parts.shift() as string];

		while (parts.length) {
			let part = parts.shift() as string;

			// Check if the last element in 'out' ends with '\'
			if (out[out.length - 1].match(/\\$/)) {
				out.push(part);
				continue;
			}

			// If there is no '-' or ' ', push the part and continue
			if (!/[\- ]/.test(part)) {
				out.push(part);
				continue;
			}

			let hasSpace = false;
			const chars = part.split('');
			const outChars: string[] = [];

			while (chars.length) {
				const char = chars.shift() as string;

				if (char === '\\') {
					outChars.push(char, chars.shift() as string);
				} else if (char === '-') {
					outChars.push("\\-");
				} else if (char === ']') {
					outChars.push(char);
					if (hasSpace && (chars.length === 0 || !/^[\*\+]/.test(chars[0]))) {
						outChars.push('*');
					}
					outChars.push(...chars);
					break;
				} else if (char === ' ') {
					outChars.push("::OPTIONAL_SPACE::");
					hasSpace = true;
				} else {
					outChars.push(char);
				}
			}

			part = outChars.join('');
			out.push(part);
		}

		pattern = out.join('[');
	}

	// Replace spaces and special placeholders with corresponding patterns
	pattern = pattern.replace(/ /g, `[\\s\\xa0]*`);
	pattern = pattern.replace(/::OPTIONAL_SPACE::/g, `\\s\\xa0`);
	pattern = pattern.replace(/\u2009/ug, `[\\s\\xa0]`);

	return pattern;
}


function formatValue(type: string, value: string): string {
	GLOBAL_VARIABLES['$TEMP_VALUE'] = [value];
	return formatVar(type, '$TEMP_VALUE');
}

function formatVar(type: string, varName: string): string {
	let values: string[] = GLOBAL_VARIABLES[varName].slice(); // Assuming `gVars` is an existing object
	if (type === 'regexp' || type === 'quote') {
		values.forEach((value: string, index: number) => {
			values[index] = values[index].replace(/\.$/, ''); // Remove trailing period
			values[index] = values[index].replace(/!(.+)$/, (match, p1) => `(?!${p1})`); // Negative lookahead
			if (type === 'quote') {
				values[index] = values[index].replace(/\\/g, '\\\\'); // Escape backslashes
				values[index] = values[index].replace(/"/g, '\\"'); // Escape quotes
			}
		});
		let out = values.join('|');
		out = handleAccents(out);
		out = out.replace(/ +/g, `#{bcv_parser::regexps.space}+`);
		return values.length > 1 ? `(?:${out})` : out;
	} else if (type === 'pegjs') {
		values.forEach((value: string, index: number) => {
			values[index] = values[index].replace(/\.(?!`)/, '" abbrev? "');
			values[index] = values[index].replace(/\.`/g, '" abbrev "');
			values[index] = values[index].replace(/([A-Z])/g, (match) => match.toLowerCase());
			values[index] = handleAccents(values[index]);
			values[index] = values[index].replace(/\[/g, '" [');
			values[index] = values[index].replace(/\]/g, '\] "');
			values[index] = `"${values[index]}"`;
			values[index] = values[index].replace(/\s*!\[/, '" ![');
			values[index] = values[index].replace(/\s*!([^\[])/, (match, group1) => `" !"${group1}`);
			values[index] = values[index].replace(/"{2,}/g, '');
			values[index] = values[index].replace(/^\s+|\s+$/g, '');
			values[index] += ' ';
			const parts = values[index].split('"');
			let isOutsideQuote = true;
			const outParts: string[] = [];

			parts.forEach((part, i) => {
				if (!isOutsideQuote) {
					if (part.startsWith(' ')) {
						outParts[outParts.length - 1] += 'space ';
						part = part.replace(/^ /, '');
					}
					part = part.replace(/ /g, '" space "');
					part = part.replace(/((?:^|")[^"]+?")( space )/g, (match, quote, space) => {
						if (/[\x80-\uFFFF]/u.test(quote)) quote += 'i'; // Add 'i' if Unicode
						return `${quote}${space}`;
					});
					outParts.push(part);
					if (/[\x80-\uFFFF]/u.test(part)) {
						parts[i + 1] = 'i' + parts[i + 1]; // Modify next part
					}
					isOutsideQuote = true;
				} else {
					outParts.push(part);
					isOutsideQuote = false;
				}
			});

			values[index] = outParts.join('"');
			values[index] = values[index].replace(/\[([^\]]*?[\x80-\uffff][^\]]*?)\]/ug, (match, g1) => {
				return `[${g1}]i`
			});
			values[index] = values[index].replace(/!(space ".+)/g, (match, g1) => {
				return `!(${g1})`
			});
			values[index] = values[index].replace(/\s+$/, '');

			if (varName === '$TO') values[index] += ' sp';
		});

		let out = values.join(' / ');
		if (['$TITLE', '$NEXT', '$FF'].includes(varName) && values.length > 1) {
			out = `( ${out} )`;
		} else if (values.length >= 2 && ['$CHAPTER', '$VERSE', '$NEXT', '$FF'].includes(varName)) {
			out = handlePegjsPrepends(out, values.slice());
		}

		return out;
	} else {
		throw new Error(`Unknown var type: ${type} / ${varName}`);
	}
}

function handlePegjsPrepends(out: string, values: string[]): string {
	const count = values.length;
	const lcs: { [key: string]: string[] } = {};

	// Iterate over values to build the `lcs` object
	values.forEach(c => {
		if (!c.startsWith('"')) return;
		for (let length = 2; length <= c.length; length++) {
			const substring = c.substring(0, length);
			if (!lcs[substring]) {
				lcs[substring] = [];
			}
			lcs[substring].push(c);
		}
	});

	// Find the longest common substring
	let longest = '';
	for (const lc in lcs) {
		if (lcs.hasOwnProperty(lc)) {
			if (lcs[lc].length === count && lc.length > longest.length) {
				longest = lc;
			}
		}
	}

	// Return original `out` if no common substring is found
	if (!longest) {
		return out;
	}

	const length = longest.length;
	const outputArray: string[] = [];

	values.forEach(c => {
		let modifiedC = c.substring(length);
		if (!/^\s*\[|^\s*abbrev\?/.test(modifiedC)) {
			modifiedC = `"${modifiedC}`;
		}
		if (modifiedC === '"') {
			return;
		}

		modifiedC = modifiedC.replace(/^"" /, '');
		if (modifiedC.length > 0) {
			outputArray.push(modifiedC);
		}
	});

	if (!/"i?\s*$/.test(longest)) {
		longest += '"';
		if (/[\x80-\u{10FFFF}]/u.test(longest)) {
			longest += 'i';
		}
	}

	return `${longest} ( ${outputArray.join(' / ')} )`;
}

function makeValidOsises(osises: string[]) {
	const out: any = {};
	let type: string = 'ot_nt';

	for (const osis of osises) {
		if (osis === 'Tob') {
			type = 'apocrypha';
		}
		out[osis] = type;
	}

	return out;
}

function ucNormalize(text: string): string {
	return text.normalize('NFD').toUpperCase().normalize('NFC');
}

function getPrePassageCharacters(patterns: string[]): string {
	let pattern = patterns.join('|');

	if (/^\[\^[^\]]+?\]$/.test(pattern)) {
		pattern = pattern.replace(/`/g, '');
		pattern = pattern.replace(/\\x1[ef]|0-9|\\d|A-Z|a-z/g, '');
		pattern = pattern.replace(/\[\^/, '[^\\x1f\\x1e\\dA-Za-z');
	} else if (pattern === '\d|\b') {
		pattern = '[^\w\x1f\x1e]';
	} else {
		throw new Error(`Unknown pre_passage pattern: ${pattern}`);
	}

	return pattern;
}


function getPreBookCharacters(unicodeBlock: string[]): string {
	if (!unicodeBlock) {
		throw new Error('No $UNICODE_BLOCK is set');
	}
	const blocks = getUnicodeBlocks(unicodeBlock);
	const letters = getLetters(blocks);
	const outArray: string[] = [];
	for (const letter of letters) {
		const [start, end] = letter;
		outArray.push(end === start ? start : `${start}-${end}`);
	}
	let out = outArray.join('');
	// Use a regular expression to match characters in the Unicode range \u0080-\u{10FFFF}
	out = out.replace(/([\x80-\u{10FFFF}])/ug, (match, group1) => `${group1}\``);
	return `[^${out}]`;
}

function getLetters(blocks: [number, number][]): [string, string][] {
	const out: { [key: number]: boolean } = {};
	const lettersFile = fs.readFileSync(CONFIG.paths.src.letters, 'utf-8');
	const lines = lettersFile.split('\n');
	for (const line of lines) {
		if (line.startsWith('\\u')) {
			let [start, end] = line.trim().replace(/\\u/g, '').replace(/\s*#.+/, '').replace(/\s+/g, '').split('-');
			end = end || start;
			const startHex = parseInt(start, 16);
			const endHex = parseInt(end, 16);
			for (const block of blocks) {
				const [startRange, endRange] = block;
				if (endHex >= startRange && startHex <= endRange) {
					for (let i = startHex; i <= endHex; i++) {
						if (i >= startRange && i <= endRange) {
							out[i] = true;
						}
					}
				}
			}
		}
	}

	const sortedKeys = Object.keys(out);;
	const outArray: [string, string][] = [];
	let prev = -2;
	for (const key of sortedKeys) {
		const pos = parseInt(key);
		// Ensure the value is within the valid Unicode range
		if (pos < 0 || pos > 0x10FFFF) {
			throw new Error(`Invalid Unicode code point: ${pos}`);
		}
		if (pos === prev + 1) {
			outArray[outArray.length - 1][1] = String.fromCharCode(pos);
		} else {
			outArray.push([String.fromCharCode(pos), String.fromCharCode(pos)]);
		}
		prev = pos;
	}
	return outArray;
}

function getUnicodeBlocks(unicodeBlock: string[]): [number, number][] {
	let unicode = unicodeBlock.join('|');
	if (!unicode.includes('Basic_Latin')) {
		unicode += '|Basic_Latin';
	}
	const out: [number, number][] = [];
	const blocksFile = fs.readFileSync(CONFIG.paths.src.blocks, 'utf-8');
	const lines = blocksFile.split('\n');
	for (const line of lines) {
		if (line.match(/^\w/)) {
			const [block, range] = line.trim().split('\t');
			if (block.match(RegExp(unicode))) {
				const [start, end] = range.replace(/\\u/g, '').split('-');
				out.push([parseInt(start, 16), parseInt(end, 16)]);
			}
		}
	}
	return out;
}
type Abbrevs = {
	[osis: string]: {
		[abbrev: string]: boolean;
	}
};

function getAbbrevs(books: IBook[], preferredBookNames: IBook[]): Abbrevs {
	const out: Abbrevs = {};
	const processedBooks: Array<IBook & { isLiteral: boolean }> = [
		...books.map((book) => ({ ...book, isLiteral: false })),
		...preferredBookNames.map((book) => {
			return {
				isLiteral: true,
				osis: book.osis,
				abbrevs: book.abbrevs.map((abbrev) => {
					return abbrev.replace(/([\x80-\uffff])/gu, (match, g1) => `${g1}\``);
				})
			};
		}),
	];

	for (const { osis, abbrevs, isLiteral } of processedBooks) {
		isValidOsis(osis);
		out[osis] = out[osis] || {};
		out[osis][osis] = true;
		if (/,/.test(osis) || !FORCE_OSIS_ABBREV) {
			delete out[osis][osis];
		}
		for (let abbrev of abbrevs) {
			if (!abbrev.length) {
				continue;
			}
			if (!isLiteral) {
				if (GLOBAL_VARIABLES[Variable.PRE_BOOK]) {
					abbrev = `${GLOBAL_VARIABLES[Variable.PRE_BOOK][0]}${abbrev}`;
				}
				if (GLOBAL_VARIABLES[Variable.POST_BOOK]) {
					abbrev += GLOBAL_VARIABLES[Variable.POST_BOOK][0];
				}
				GLOBAL_RAW_ABBREVS[osis] = GLOBAL_RAW_ABBREVS[osis] || {};
				GLOBAL_RAW_ABBREVS[osis][abbrev] = true;
			}
			abbrev = handleAccents(abbrev);
			const alts = expandAbbrevVars(abbrev);
			if (/.\$/.test(JSON.stringify(alts))) {
				throw new Error(`Alts: ${JSON.stringify(alts)}`);
			}
			for (const alt of alts) {
				if (/[\[\?]/.test(alt)) {
					const expandedAbbrev = expandAbbrev(alt);
					for (const expanded of expandedAbbrev) {
						out[osis][expanded] = true;
					}
				} else {
					out[osis][alt] = true;
				}
			}
		}
	}

	return out;
}


function handleAccents(text: string): string {
	let chars: string[] = [...text]; // Split the text into an array of characters
	let texts: string[] = [];
	let context: string = '';
	while (chars.length > 0) {
		let char = chars.shift()!;

		if (/^[\x80-\uFFFF]$/u.test(char)) {
			if (chars.length > 0 && chars[0] === '`') {
				texts.push(char);
				texts.push(chars.shift()!);
				continue;
			}
			char = handleAccent(char);
			if (context === '[') {
				char = char.replace(/^\[|\]$/g, ''); // Removes square brackets if in context
			}
		} else if (chars.length > 0 && chars[0] === '`') {
			texts.push(char);
			texts.push(chars.shift()!);
			continue;
		} else if (char === '[' && !(texts.length > 0 && texts[texts.length - 1] === '\\')) {
			context = '[';
		} else if (char === ']' && !(texts.length > 0 && texts[texts.length - 1] === '\\')) {
			context = '';
		}

		texts.push(char);
	}

	text = texts.join('');

	// Applying regex replacements similar to the original Perl code
	text = text.replace(/'/g, '[\u2019\']'); // Replace apostrophe with right single quotation mark
	// Conditional replacement based on COLLAPSE_COMBINING_CHARACTERS
	if (COLLAPSE_COMBINING_CHARACTERS) {
		text = text.replace(/\u02C8(?!`)/g, '[\u02C8\']'); // Replace modifier letter vertical line
	}
	text = text.replace(/([\x80-\uFFFF])`/g, '$1');
	text = text.replace(/[\u02B9\u0374]/g, '[\'\u2019\u0384\u0374\u02B9]'); // Replace specified characters
	text = text.replace(/([\u0300\u0370]-)\['\u2019\u0384\u0374\u02B9\](\u0376)/g, '$1\u0374$2'); // Replace accents
	text = text.replace(/\.(?!`)/g, '\\.?'); // Escape period
	text = text.replace(/\.`/g, '\\.'); // Escape period followed by `
	text = text.replace(/ `/g, '\u2009'); // Replace space followed by ` with thin space
	return text;
}

function handleAccent(char: string): string {
	let alt = char.normalize('NFD');
	if (COLLAPSE_COMBINING_CHARACTERS) {
		alt = alt.replace(/\p{M}/gu, ''); // remove combining characters
	}
	alt = alt.normalize('NFC');
	if (char !== alt && alt.length > 0 && /[^\s\d]/.test(alt)) {
		return `[${char}${alt}]`;
	}

	for (let i = 0; i < 10; i++) {
		char = char.replace(NON_LATIN_DIGITS_REGEXPS[i], () => `[${char}${i}]`);
	}

	return char;
}

function isNextCharOptional(chars: string[]): [boolean, string[]] {
	let isOptional = false;
	if (chars.length > 0 && chars[0] === '?') {
		chars.shift();	// Remove the first element
		isOptional = true;
	}
	return [isOptional, chars];
}

function expandAbbrev(abbrev: string): string[] {
	if (!/[\[\(?\|\\]/.test(abbrev)) {
		return [abbrev];
	}

	abbrev = abbrev.replace(/(<!\\)\./g, '\\.');
	let chars = abbrev.split('');
	let outs = [''];

	while (chars.length > 0) {
		let char = chars.shift()!;
		let isOptional = false;
		const nexts: string[] = [];

		if (char === '[') {
			while (chars.length > 0) {
				const next = chars.shift()!;
				if (next === ']') {
					break;
				} else if (next === '\\') {
					continue;
				} else {
					let accents = handleAccent(next);
					accents = accents.replace(/^\[|\]$/g, '');
					for (let i = 0; i < accents.length; i++) {
						nexts.push(accents[i]);
					}
				}
			}
			[isOptional, chars] = isNextCharOptional(chars);
			if (isOptional) nexts.push('');
			const temps: string[] = [];
			for (const out of outs) {
				const alreadys = {};
				for (const next of nexts) {
					if (!alreadys.hasOwnProperty(next)) {
						temps.push(out + next);
						alreadys[next] = true;
					}
				}
			}
			outs = temps;
		} else if (char === '(') {
			const nexts: string[] = [];
			while (chars.length > 0) {
				const next = chars.shift()!;
				if (next === '?' && chars[0] === ':') {
					throw new Error("'(?:' in parentheses; replace with just '('");
				}
				if (next === ')') {
					break;
				} else if (next === '\\') {
					nexts.push(next);
					nexts.push(chars.shift()!);
				} else {
					nexts.push(next);
				}
			}
			const expandedNexts = expandAbbrev(nexts.join(''));
			[isOptional, chars] = isNextCharOptional(chars);
			if (isOptional) expandedNexts.push('');
			const temps: string[] = [];
			for (const out of outs) {
				for (const next of expandedNexts) {
					temps.push(out + next);
				}
			}
			outs = temps;
		} else if (char === '|') {
			return [...outs, ...expandAbbrev(chars.join(''))];
		} else {
			const temps: string[] = [];
			if (char === '\\') {
				char = chars.shift()!;
			}
			[isOptional, chars] = isNextCharOptional(chars);
			for (const out of outs) {
				temps.push(out + char);
				if (isOptional) {
					temps.push(out);
				}
			}
			outs = temps;
		}
	}

	if (/[\[\]]/.test(outs.join(''))) {
		logger.error("Unexpected char: ", outs, 'abbrev', abbrev);
		throw new Error("Unexpected char");
	}

	return outs;
}

function sortAbbrevsByLength(abbrevs: string[]): string[] {
	const lengths: { [key: number]: string[] } = {};
	const out: string[] = [];

	abbrevs.forEach((abbrev) => {
		const length = abbrev.length;
		if (!lengths[length]) {
			lengths[length] = [];
		}
		lengths[length].push(abbrev);
	});

	Object.keys(lengths)
		.sort((a, b) => parseInt(b) - parseInt(a))
		.forEach((length) => {
			lengths[length].sort();
			out.push(...lengths[length]);
		});

	return out;
}

function expandAbbrevVars(abbrev: string): string[] {
	// Remove backslashes except before specific characters
	abbrev = abbrev.replace(/\\(?![\(\)\[\]\|s])/g, '');

	// Return early if no variable pattern is found
	if (!/\$[A-Z]+/.test(abbrev)) {
		return [abbrev];
	}

	const varMatch = abbrev.match(/(\$[A-Z]+)(?!\w)/);
	if (!varMatch) {
		return [abbrev];
	}
	const varName = varMatch[0];

	let out: string[] = [];
	let recurse = false;

	// Iterate through each value of the matched variable
	for (const value of GLOBAL_VARIABLES[varName] || []) {
		for (const val of expandAbbrev(value)) {
			const processedVal = handleAccents(val);
			let temp = abbrev.replace(/\$[A-Z]+(?!\w)/, processedVal);

			if (/\$/.test(temp)) {
				recurse = true;
			}
			out.push(temp);

			// Handle special cases for certain variables like FIRST, SECOND, etc.
			if (/^\$(?:FIRST|SECOND|THIRD|FOURTH|FIFTH)$/.test(varName) && /^\d|^[IV]+$/.test(processedVal)) {
				let temp2 = abbrev.replace(RegExp(escapeRegex(varName) + '([^.]|$)'), `${processedVal}.$1`);
				out.push(temp2);
			}
		}
	}

	// Handle recursion if needed
	if (recurse) {
		let recursiveResults: string[] = [];
		for (const abbrev of out) {
			recursiveResults = recursiveResults.concat(expandAbbrevVars(abbrev));
		}
		out = recursiveResults;
	}

	return out;
}

// Utility to escape special characters in regex
function escapeRegex(string: string): string {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function addAbbrevToAllAbbrevs(osis: string, abbrev: string, allAbbrevs: any): { [key: string]: string[] } {
	if (!allAbbrevs.hasOwnProperty(osis)) allAbbrevs[osis] = {};
	if (abbrev.includes('.') && abbrev !== "\u0418.\u041d") {
		const news = abbrev.split('.');
		let olds = [news.shift() as string];

		for (const newAbbrev of news) {
			const temp: string[] = [];
			for (const old of olds) {
				temp.push(`${old}.${newAbbrev}`);
				temp.push(`${old}${newAbbrev}`);
			}
			olds = temp;
		}

		for (const abbr of olds) {
			allAbbrevs[osis][abbr] = true
		}
	} else {
		allAbbrevs[osis][abbrev] = true
	}
	return allAbbrevs;
}

function stringHasNonLatinDigits(str: string): boolean {
	return ALL_NON_LATIN_DIGITS_REGEXP.test(str);
}

function addNonLatinDigitTests(osis: string, args: string[]) {
	const out: any = [];
	const temp = args.join("\n");

	if (!stringHasNonLatinDigits(temp)) {
		return out;
	}

	out.push("\t\t`");
	out.push("\t\ttrue");
	out.push(`\tit "should handle non-Latin digits in book: ${osis} (${lang})", ->`);
	out.push(`\t\tp.set_options non_latin_digits_strategy: "replace"`);
	out.push("\t\t`");

	return [...out, ...args];
}

function addRangeTests() {
	const assertions: IAssertionData[] = []

	for (const abbrev of GLOBAL_VARIABLES["$TO"]) {
		for (const to of expandAbbrev(removeExclamations(handleAccents(abbrev)))) {
			assertions.push({ input: `"Titus 1:1 ${to} 2"`, expected: '"Titus.1.1-Titus.1.2"' });
			assertions.push({ input: `"Matt 1${to}2"`, expected: '"Matt.1-Matt.2"' });
			assertions.push({ input: `"Phlm 2 ${ucNormalize(to)} 3"`, expected: '"Phlm.1.2-Phlm.1.3"' });
		}
	}

	return assertions;
}

function addChapterTests() {
	const assertions: IAssertionData[] = []

	for (const abbrev of GLOBAL_VARIABLES["$CHAPTER"]) {
		for (const chapter of expandAbbrev(removeExclamations(handleAccents(abbrev)))) {
			assertions.push({ input: `"Titus 1:1, ${chapter} 2"`, expected: '"Titus.1.1,Titus.2"' });
			assertions.push({ input: `"Matt 3:4 ${ucNormalize(chapter)} 6"`, expected: '"Matt.3.4,Matt.6"' });
		}
	}

	return assertions;
}

function addVerseTests() {
	const assertions: IAssertionData[] = []

	for (const abbrev of GLOBAL_VARIABLES["$VERSE"]) {
		for (const verse of expandAbbrev(removeExclamations(handleAccents(abbrev)))) {
			assertions.push({ input: `"Exod 1:1 ${verse} 3"`, expected: '"Exod.1.1,Exod.1.3"' });
			assertions.push({ input: `"Phlm ${ucNormalize(verse)} 6"`, expected: '"Phlm.1.6"' });
		}
	}

	return assertions;
}

function addSequenceTests() {
	const assertions: IAssertionData[] = []

	for (const abbrev of GLOBAL_VARIABLES[Variable.AND]) {
		for (const and of expandAbbrev(removeExclamations(handleAccents(abbrev)))) {
			assertions.push({ input: `"Exod 1:1 ${and} 3"`, expected: '"Exod.1.1,Exod.1.3"' });
			assertions.push({ input: `"Phlm 2 ${ucNormalize(and)} 6"`, expected: '"Phlm.1.2,Phlm.1.6"' });
		}
	}

	return assertions;
}

function addTitleTests() {
	const assertions: IAssertionData[] = []

	for (const abbrev of GLOBAL_VARIABLES["$TITLE"]) {
		for (const title of expandAbbrev(removeExclamations(handleAccents(abbrev)))) {
			assertions.push({ input: `"Ps 3 ${title}, 4:2, 5:${title}"`, expected: '"Ps.3.1,Ps.4.2,Ps.5.1"' });
			assertions.push({ input: `"${ucNormalize(`Ps 3 ${title}, 4:2, 5:${title}`)}"`, expected: '"Ps.3.1,Ps.4.2,Ps.5.1"' });
		}
	}

	return assertions;
}

function addFfTests() {
	const assertions: IAssertionData[] = []

	for (const abbrev of GLOBAL_VARIABLES["$FF"]) {
		let o_ff = handleAccents(abbrev);
		o_ff = removeExclamations(o_ff);
		const o_ffs = expandAbbrev(o_ff);
		for (const ff of o_ffs) {
			assertions.push({ input: `"Rev 3${ff}, 4:2${ff}"`, expected: '"Rev.3-Rev.22,Rev.4.2-Rev.4.11"' });
			if (lang !== 'it') {
				assertions.push({ input: `"${ucNormalize(`Rev 3 ${ff}, 4:2 ${ff}`)}"`, expected: '"Rev.3-Rev.22,Rev.4.2-Rev.4.11"' });
			}
		}
	}

	return assertions;
}

function addNextTests() {
	if (!GLOBAL_VARIABLES['$NEXT']) {
		return [];
	}

	const assertions: IAssertionData[] = []

	for (const abbrev of GLOBAL_VARIABLES['$NEXT']) {
		for (const next of expandAbbrev(removeExclamations(handleAccents(abbrev)))) {
			assertions.push({ input: `"Rev 3:1${next}, 4:2${next}"`, expected: '"Rev.3.1-Rev.3.2,Rev.4.2-Rev.4.3"' });
			if (lang !== 'it') {
				assertions.push({ input: `"${ucNormalize(`Rev 3 ${next}, 4:2 ${next}`)}"`, expected: '"Rev.3-Rev.4,Rev.4.2-Rev.4.3"' });
			}
			assertions.push({ input: `"Jude 1${next}, 2${next}"`, expected: '"Jude.1.1-Jude.1.2,Jude.1.2-Jude.1.3"' });
			assertions.push({ input: `"Gen 1:31${next}"`, expected: '"Gen.1.31-Gen.2.1"' });
			assertions.push({ input: `"Gen 1:2-31${next}"`, expected: '"Gen.1.2-Gen.2.1"' });
			assertions.push({ input: `"Gen 1:2${next}-30"`, expected: '"Gen.1.2-Gen.1.3,Gen.1.30"' });
			assertions.push({ input: `"Gen 50${next}, Gen 50:26${next}"`, expected: '"Gen.50,Gen.50.26"' });
			assertions.push({ input: `"Gen 1:32${next}, Gen 51${next}"`, expected: '""' });
		}
	}

	return assertions;
}

function addTransTests() {
	const assertions: IAssertionData[] = []

	for (const abbrev of GLOBAL_VARIABLES['$TRANS'].toSorted()) {
		for (const translation of expandAbbrev(removeExclamations(handleAccents(abbrev)))) {
			let [trans, osis] = translation.split(',') || [translation, translation];
			if(!osis) osis = trans;
			assertions.push({ input: `"Lev 1 (${trans})"`, expected: `[["Lev.1", "${osis}"]]` });
			assertions.push({ input: (`"Lev 1 ${trans}"`).toLowerCase(), expected: `[["Lev.1", "${osis}"]]` });
		}
	}

	return assertions;
}

function addBookRangeTests() {
	const first = expandAbbrev(handleAccents(GLOBAL_VARIABLES[Variable.FIRST][0]))[0];
	const third = expandAbbrev(handleAccents(GLOBAL_VARIABLES[Variable.THIRD][0]))[0];
	let john = '';

	for (const key of Object.keys(GLOBAL_RAW_ABBREVS['1John']).sort()) {
		if (/^\$FIRST/.test(key)) {
			john = key.replace(/^\$FIRST(?!\w)/, '');
			break;
		}
	}

	if (!john) {
		logger.warn("	Warning: no available John abbreviation for testing book ranges");
		return [];
	}

	const assertions: IAssertionData[] = [];
	const johns = expandAbbrev(handleAccents(john));

	const alreadys: Record<string, number> = {};

	for (const abbrev of johns) {
		for (const to_regex of GLOBAL_VARIABLES['$TO']) {
			for (const to of expandAbbrev(removeExclamations(handleAccents(to_regex)))) {
				if (!alreadys[`${first} ${to} ${third} ${abbrev}`]) {
					assertions.push({ input: `"${first} ${to} ${third} ${abbrev}"`, expected: '"1John.1-3John.1"' });
					alreadys[`${first} ${to} ${third} ${abbrev}`] = 1;
				}
			}
		}
	}

	return assertions;
}

function addBoundaryTests() {
	const assertions: IAssertionData[] = [];
	assertions.push({ input: `"\\u2014Matt\\u2014"`, expected: '"Matt.1-Matt.28"' });
	assertions.push({ input: `"\\u201cMatt 1:1\\u201d"`, expected: '"Matt.1.1"' });
	return assertions;
}

function removeExclamations(text: string): string {
	if (text.includes('!')) {
		text = text.split('!')[0];
	}
	return text;
}

function normalize(text: string): string {
	return text.normalize('NFD').normalize('NFC');
}

function prepareData (dataFileContent: string): IData {
	const data = JSON.parse(dataFileContent);
	const out: IData = {
		variables: prepareVariables(data.variables),
		books: prepareBooks(data.books),
		order: data.order.map(normalize),
		preferredBookNames: prepareBooks(data.preferredBookNames),
	};

	return out;
}

function prepareBooks (books: object): IBook[] {
	return Object.entries(books).map(([osis, names]) => {
		return {
			osis: normalize(osis),
			abbrevs: names.map(normalize),
		};
	});
}

function prepareVariables (variables: { [key: string]: any }): Partial<IInputDataVariables> {
	const out: Partial<IInputDataVariables> = {};

	for (const [key, values] of Object.entries(variables)) {
		if (typeof values === 'string') {
			out[key] = normalize(values);
			continue;
		}
		if (!Array.isArray(values)) {
			out[key] = values;
			continue;
		}
		out[key] = values.map(normalize);
	}

	return out;
}
