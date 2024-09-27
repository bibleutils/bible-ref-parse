import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { argv } from 'process';

// GLOBAL VARIABLES
const gScriptPath = path.resolve(__dirname, '..');
const gDir: string = `${gScriptPath}/src`;
const gTestDir: string = `${gScriptPath}/test`;
const gRegexpSpace = '[\\s\u00a0}]';
let gValidCharacters = "[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\"'\\*=~\\-\\u2013\\u2014]";
const gValidOsises = makeValidOsises([
	'Gen', 'Exod', 'Lev', 'Num', 'Deut', 'Josh', 'Judg', 'Ruth', '1Sam', '2Sam', '1Kgs', '2Kgs', '1Chr', '2Chr', 'Ezra', 'Neh', 'Esth',
	'Job', 'Ps', 'Prov', 'Eccl', 'Song', 'Isa', 'Jer', 'Lam', 'Ezek', 'Dan', 'Hos', 'Joel', 'Amos', 'Obad', 'Jonah', 'Mic', 'Nah', 'Hab', 'Zeph',
	'Hag', 'Zech', 'Mal', 'Matt', 'Mark', 'Luke', 'John', 'Acts', 'Rom', '1Cor', '2Cor', 'Gal', 'Eph', 'Phil', 'Col', '1Thess', '2Thess',
	'1Tim', '2Tim', 'Titus', 'Phlm', 'Heb', 'Jas', '1Pet', '2Pet', '1John', '2John', '3John', 'Jude', 'Rev', 'Tob', 'Jdt', 'GkEsth', 'Wis',
	'Sir', 'Bar', 'PrAzar', 'Sus', 'Bel', 'SgThree', 'EpJer', '1Macc', '2Macc', '3Macc', '4Macc', '1Esd', '2Esd', 'PrMan', 'AddEsth', 'AddDan',
]);

// PROGRAM STARTS HERE
const lang = process.argv[2];

if (!lang || !/^\w+$/.test(lang)) {
	console.error('The first argument should be a language iso code (e.g., "fr")');
	process.exit(1);
}
console.log(`${argv[1]} Starting...`);

const gRawAbbrevs: any = {};
console.log("Global 'gRawAbbrevs' Variable Value: ", gRawAbbrevs);
const gVars = getVars();
console.log("Global 'gVars' Variable Value: ", gVars);
const gAbbrevs: any = getAbbrevs();
console.log("Global 'gAbbrevs' Variable Value: ", gAbbrevs);
const gOrder = getOrder();
console.log("Global 'gOrder' Variable Value: ", gOrder);
const gAllAbbrevs = makeTests();
console.log("Make Regular Expressions...");
// Every global variable is matching till this point
makeRegexps();
console.log("Make Grammer...");
makeGrammar();
const defaultAlternatesFile = `${gDir}/en/translation_alternates.coffee`;
console.log("Make Translations...");
makeTranslations();

// PROGRAM ENDS HERE

// FUNCTION DECLARATIONS
// Utility function to check if a file exists (to replicate `-f` operator in Perl)
function fileExists(path: string): boolean {
	try {
		// Assuming a Node.js environment where `fs` module can be used
		return fs.existsSync(path);
	} catch (err) {
		return false;
	}
}

function escapeRegExp(pattern: string) {
	return pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getVars() {
	const out = {};
	const fileName: string = path.join(gScriptPath, 'src', lang, 'data.txt');
	if (!fileExists(fileName)) {
		console.log(`Current Working Dir: ${__dirname}`);
		console.error(`Can't open ${fileName}. Make sure it is present.`);
		process.exit(1);
	}

	try {
		const fileContent = fs.readFileSync(fileName, { encoding: 'utf-8', flag: 'r' });
		const lines = fileContent.split('\n');
		for (const line of lines) {
			if (/^\$/.test(line)) {
				const [key, ...values] = line.normalize('NFD').normalize('NFC').split(/\t/);
				if (!values.length) {
					console.log(`Current Working Dir: ${__dirname}`);
					console.error(`No values for ${key}`);
					process.exit(2);
				}
				out[key] = values;
			}
		}
	} catch (error: any) {
		console.log(`Current Working Dir: ${__dirname}`);
		console.error(`Unexpected Error: ${error.message}`);
		process.exit(3);
	}

	if (out['$ALLOWED_CHARACTERS']) {
		for (const char of out['$ALLOWED_CHARACTERS']) {
			const check = escapeRegExp(char);
			if (!gValidCharacters.includes(check)) {
				gValidCharacters += char;
			}
		}
	}

	const letters = getPreBookCharacters(out['$UNICODE_BLOCK']);
	if (!out['$PRE_BOOK_ALLOWED_CHARACTERS'])
		out['$PRE_BOOK_ALLOWED_CHARACTERS'] = [letters];
	if (!out['$POST_BOOK_ALLOWED_CHARACTERS'])
		out['$POST_BOOK_ALLOWED_CHARACTERS'] = [gValidCharacters];
	if (!out['$PRE_PASSAGE_ALLOWED_CHARACTERS'])
		out['$PRE_PASSAGE_ALLOWED_CHARACTERS'] = [getPrePassageCharacters(out['$PRE_BOOK_ALLOWED_CHARACTERS'])];
	out['$LANG'] = [lang];
	if (!out['$LANG_ISOS'])
		out['$LANG_ISOS'] = [lang];

	return out;
}

function getOrder() {
	let out = [];
	const fileName = `${gDir}/${lang}/data.txt`;
	if (fileExists(fileName)) {
		const file = fs.readFileSync(fileName, 'utf-8');
		for (const line of file.split('\n')) {
			if (!line.startsWith('=')) {
				continue;
			}
			const osis = line.replace(/^=/, '').normalize('NFD').normalize('NFC');
			isValidOsis(osis);
			const apocrypha = gValidOsises[osis] === 'apocrypha' ? true : false;
			out.push({ osis, apocrypha });
			gAbbrevs[osis] = gAbbrevs[osis] || {};
			gAbbrevs[osis][osis] = true;
			gRawAbbrevs[osis] = gRawAbbrevs[osis] || {};
			gRawAbbrevs[osis][osis] = true;
		}
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
	let osises = [...gOrder];
	let allAbbrevsInMakeTests = {};

	// Append any OSIS with a comma
	Object.keys(gAbbrevs).toSorted().forEach(osis => {
		if (osis.includes(',')) {
			osises.push({ osis, apocrypha: 0 });
		}
	});

	osises.forEach(ref => {
		const osis = ref.osis;
		let tests: string[] = [];
		const [first] = osis.split(',');
		const match = `${first}.1.1`;

		// Process each abbreviation for the current OSIS
		sortAbbrevsByLength(Object.keys(gAbbrevs[osis])).forEach(abbrev => {
			expandAbbrevVars(abbrev).toSorted().forEach(expanded => {
				allAbbrevsInMakeTests = addAbbrevToAllAbbrevs(osis, expanded, allAbbrevsInMakeTests);
				tests.push(`\t\texpect(p.parse("${expanded} 1:1").osis()).toEqual("${match}", "parsing: '${expanded} 1:1'")`);
			});

			// Handle alternate OSIS abbreviations
			osises.forEach(altOsis => {
				if (osis === altOsis) return;

				// if(!gAbbrevs.hasOwnProperty(altOsis)) continue;
				if (!gAbbrevs.hasOwnProperty(altOsis)) return;
				Object.keys(gAbbrevs[altOsis]).forEach(altAbbrev => {
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
								console.log(`${altOsis} should be before ${osis} in parsing order\n  ${altAbbrev} matches ${abbrev}`);
							}
						});
					}
				});
			});
		});

		// Adding test descriptions
		out.push(`describe "Localized book ${osis} (${lang})", ->`);
		out.push("\tp = {}");
		out.push("\tbeforeEach ->");
		out.push("\t\tp = new bcv_parser");
		out.push(`\t\tp.set_options book_alone_strategy: "ignore",book_sequence_strategy: "ignore",osis_compaction_strategy: "bc",captive_end_digits_strategy: "delete"`);
		out.push("\t\tp.include_apocrypha true");
		out.push(`\tit "should handle book: ${osis} (${lang})", ->`);
		out.push("\t\t`");
		out.push(...tests);
		out.push(...addNonLatinDigitTests(osis, tests));

		if(osis === '2Chr' || osis === '2Sam' || osis === '1Sam') {
			console.log("Test-002");
		}
		// Add valid non-apocryphal OSIS tests
		if (gValidOsises[first] !== 'apocrypha') {
			out.push("\t\tp.include_apocrypha(false)");
			sortAbbrevsByLength(Object.keys(gAbbrevs[osis])).forEach(abbrev => {
				expandAbbrevVars(abbrev).forEach(expanded => {
					const normalized = ucNormalize(expanded);
					out.push(`\t\texpect(p.parse("${normalized} 1:1").osis()).toEqual("${match}", "parsing: '${normalized} 1:1'")`);
				});
			});
		}
		out.push("\t\t`");
		out.push("\t\ttrue"); // Always return something in CoffeeScript.
		// }
	});
	
	// Write the book names to a file
	const bookNamesPath = `${gDir}/${lang}/book_names.txt`;
	let allabbrevs_sorted = Object.keys(allAbbrevsInMakeTests).toSorted();
	
	for (let osis of allabbrevs_sorted) {
		const osisAbbrevs = sortAbbrevsByLength(Object.keys(allAbbrevsInMakeTests[osis]));
		const useOsis = osis.replace(/,+$/, '');
		for (const abbrev of osisAbbrevs) {
			const use = abbrev.replace(/\u2009/ug, ' ');
			fs.writeFileSync(bookNamesPath, `${useOsis}\t${use}\n`, { encoding: 'utf-8' });
		}
		allAbbrevsInMakeTests[osis] = osisAbbrevs;
	}
	

	// Create and write additional tests
	const miscTests = [
		addRangeTests(),
		addChapterTests(),
		addVerseTests(),
		addSequenceTests(),
		addTitleTests(),
		addFfTests(),
		addNextTests(),
		addTransTests(),
		addBookRangeTests(),
		addBoundaryTests()
	].flat();

	// Replace placeholders in the spec template
	let template = getFileContents(`${gDir}/template/spec.coffee`);
	const langIsos = JSON.stringify(gVars['$LANG_ISOS']);
	template = template.replace(/\$LANG_ISOS/g, langIsos);
	template = template.replace(/\$LANG/g, lang);
	template = template.replace(/\$BOOK_TESTS/, out.join("\n"));
	template = template.replace(/\$MISC_TESTS/, miscTests.join("\n"));
	fs.writeFileSync(`${gDir}/${lang}/spec.coffee`, template, { encoding: 'utf-8' });

	// Write HTML SpecRunner
	let specRunner = getFileContents(`${gDir}/template/SpecRunner.html`);
	specRunner = specRunner.replace(/\$LANG/g, lang);
	fs.writeFileSync(`${gTestDir}/${lang}.html`, specRunner, { encoding: 'utf-8' });

	return allAbbrevsInMakeTests;
}

function makeRegexps() {
	let out = getFileContents(`${gDir}/template/regexps.coffee`);

	if (!gVars['$NEXT']) {
		out = out.replace(/\n.+\$NEXT.+\n/, '\n');
		if (/\$NEXT\b/.test(out)) {
			throw new Error('Regexps: next');
		}
	}

	const osises = gOrder.slice();
	const sortedRawAbbrevs = Object.keys(gRawAbbrevs).sort();
	sortedRawAbbrevs.forEach(osis => {
		if (!osis.includes(',')) return;

		let temp = osis.replace(/,+$/, '');	// Replace last comma
		const apocrypha = (gValidOsises[temp] && gValidOsises[temp] === 'apocrypha') ? true : false;
		osises.push({ osis, apocrypha });
	});

	const bookRegexps = makeRegexpSet(osises);
	out = out.replace(/\$BOOK_REGEXPS/, bookRegexps);
	out = out.replace(/\$VALID_CHARACTERS/, gValidCharacters);

	const prePassageAllowedCharacters = gVars['$PRE_PASSAGE_ALLOWED_CHARACTERS'].join('|');
	out = out.replace(/\$PRE_PASSAGE_ALLOWED_CHARACTERS/g, prePassageAllowedCharacters);

	const preBookAllowedCharacters = gVars['$PRE_BOOK_ALLOWED_CHARACTERS'].map((value: string) => formatValue('quote', value)).join('|');
	out = out.replace('$PRE_BOOK_ALLOWED_CHARACTERS', preBookAllowedCharacters);

	const passageComponents: string[] = [];
	for (const varName of ['$CHAPTER', '$NEXT', '$FF', '$TO', '$AND', '$VERSE']) {
		if (gVars[varName]) {
			passageComponents.push(...gVars[varName].map((value: any) => formatValue('regexp', value)));
		}
	}

	passageComponents.sort((a, b) => b.length - a.length);
	out = out.replace(/\$PASSAGE_COMPONENTS/g, passageComponents.join(' | '));

	Object.keys(gVars).sort().forEach((key) => {
		const safeKey = key.replace(/^\$/, '\\$');
		const regex = RegExp(`${safeKey}(?!\\w)`, 'g');
		out = out.replace(regex, formatVar('regexp', key));
	});

	fs.writeFileSync(`${gDir}/${lang}/regexps.coffee`, out, { encoding: 'utf-8' });

	const match = out.match(/\$[A-Z_]+/);
	if (match) {
		throw new Error(`${match[0]}\nRegexps: Capital variable`);
	}
}

function makeRegexpSet(refs: any): string {
	const out = [];
	let hasPsalmCb = false;

	for (const ref of refs) {
		const { osis, apocrypha } = ref;
		if(osis === '2Chr' || osis === '2Sam' || osis === '1Sam') {
			console.log("Test-001");
		}
		if (osis === 'Ps' && !hasPsalmCb && fileExists(`${gDir}/${lang}/psalm_cb.coffee`)) {
			out.push(getFileContents(`${gDir}/${lang}/psalm_cb.coffee`));
			hasPsalmCb = true;
		}

		const safes: { [abbrev: string]: number } = {};
		for (const abbrev of Object.keys(gRawAbbrevs[osis])) {
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

	if(osis === 'Bel') {
		console.log("Test-001");
	}
	for (let abbrev of sortedSafes) {
		abbrev = abbrev.replace(/ /g, `${gRegexpSpace}*`);
		abbrev = abbrev.replace(/[\u200B]/g, () => {
			let temp = gRegexpSpace;
			// Replace the closing bracket ']' at the end of 'temp' with \u200B followed by ']'
			temp = temp.replace(/\]$/, '\u200B]');
			return `${temp}*`;
		});
		abbrev = handleAccents(abbrev);
		abbrev = abbrev.replace(/\$[A-Z]+(?!\w)/g, (match) => formatVar('regexp', match) + "\\.?");
		abbrevList.push(abbrev);
	}
	
	const bookRegexp = makeBookRegexp(osis, gAllAbbrevs[osis].slice(), 1);
	osis = osis.replace(/,+$/, '');
	osis = osis.replace(/,/g, `", "`);
	out.push(`\t\tosis: ["${osis}"]\x0a\t\t`);
	if (apocrypha) out.push("apocrypha: true\x0a\t\t");
	let pre = '#{bcv_parser::regexps.pre_book}';
	if (/^[0-9]/.test(osis) || /[0-9]/.test(abbrevList.join('|'))) {
		pre = gVars['$PRE_BOOK_ALLOWED_CHARACTERS'].map((char: string) => formatValue('quote', char)).join('|');
		if (pre === "\\\\d|\\\\b") {
			pre = '\\b';
		}
		pre = pre.replace(/\\+d\|?/, '');
		pre = pre.replace(/^\|+/, '');
		pre = pre.replace(/^\||\|\||\|$/, ''); // remove leftover |
		pre = pre.replace(/^\[\^/, '[^0-9'); // if it's a negated class, add \d
	}

	const post = gVars['$POST_BOOK_ALLOWED_CHARACTERS'].join('|');
	out.push(`regexp: ///(^|${pre})(\x0a\t\t`);
	out.push(bookRegexp);
	out[out.length - 1] = out[out.length - 1].replace(/-(?!\?)/g, '-?');
	out.push(`\x0a\t\t\t)(?:(?=${post})|\$)///gi`);

	return out.join("");
}

function makeBookRegexp(osis: string, abbrevs: string[], recurseLevel: number) {
	// Remove backslashes from each abbreviation
	if(osis === '2Chr' || osis === '2Sam' || osis === '1Sam') {
		console.log("Test-001");
	}
	abbrevs.map(abbrev => abbrev.replace(/\\/g, ''));

	// Get subsets of the book abbreviations
	const subsets = getBookSubsets(abbrevs.slice());
	const out: string[] = [];
	let i = 1;

	for (const subset of subsets) {
		const json = JSON.stringify(subset);
		let base64 = Buffer.from(json).toString('base64');
		console.log(`${osis} ${base64.length}`);

		let useFile = false;

		if (base64.length > 128_000 || base64.length > 8190) { // Ubuntu limitation & windows limitation on command line
			useFile = true;
			fs.writeFileSync('./temp.txt', json);
			base64 = '<';
		}

		let regexp = execSync(`node ${gScriptPath}/bin/make_regexps.js "${base64}"`).toString();

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
	};

	validateFullNodeRegexp(osis, out.join('|'), abbrevs);
	return out.join('|');
}

function validateFullNodeRegexp(osis: string, pattern: string, abbrevs: string[]): void {
	abbrevs.forEach(abbrev => {
		let compare = `${abbrev} 1`;
		const regex = RegExp(`^(?:${pattern}) `);
		compare = compare.replace(regex, '');
		if (compare !== '1') {
			console.error(`	Not parsable (${abbrev}): '${compare}'\n${pattern}`);
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
			const regex = RegExp(pat, 'u');  // 'u' flag enables Unicode matching
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
	let out = getFileContents(`${gDir}/template/translations.coffee`);
	const regexps: string[] = [];
	const aliases: string[] = [];

	for (const translation of gVars['$TRANS']) {
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

	const translationAliasesPath = `${gDir}/${lang}/translation_aliases.coffee`;
	if (fs.existsSync(translationAliasesPath)) {
		alias = getFileContents(translationAliasesPath);
		out = out.replace(/\t+(\$TRANS_ALIAS)/g, (match, group1) => group1);
	}

	let alternate = getFileContents(defaultAlternatesFile);
	const translationAlternatesPath = `${gDir}/${lang}/translation_alternates.coffee`;
	if (fs.existsSync(translationAlternatesPath)) {
		alternate = getFileContents(translationAlternatesPath);
	}

	out = out.replace(/\$TRANS_REGEXP/g, regexp);
	out = out.replace(/\$TRANS_ALIAS/g, alias);
	out = out.replace(/\s*\$TRANS_ALTERNATE/g, `\n${alternate}`);

	const langIsos = JSON.stringify(gVars['$LANG_ISOS']);
	out = out.replace(/\$LANG_ISOS/g, langIsos);

	fs.writeFileSync(`${gDir}/${lang}/translations.coffee`, out, { encoding: 'utf-8' });

	if (/\$[A-Z_]+/.test(out)) {
		throw new Error('Translations: Capital variable');
	}
}

function makeGrammar() {
	let out = getFileContents(`${gDir}/template/grammar.pegjs`);

	if (!gVars['$NEXT']) {
		out = out.replace(/\nnext_v\s+=.+\s+\{ return[^\}]+\}\s+\}\s+/, '\n');
		out = out.replace(/\bnext_v \/ /g, '');
		out = out.replace(/\$NEXT \/ /g, '');
		if (/\bnext_v\b|\$NEXT/.test(out)) {
			throw new Error('Grammar: next_v');
		}
	}

	// Assuming vars is an object (hash in Perl)
	for (const key of Object.keys(gVars).sort()) {
		// Escape any leading '$' in the key
		const safeKey = key.replace(/^\$/, '\\$');

		// Perform a global replacement in the string `out` using a regex pattern
		const regex = new RegExp(`(${safeKey})\\b`, 'g');  // (?![\\w]) ensures no word character follows

		// Replace occurrences of the safeKey with the result of format_var('pegjs', key)
		out = out.replace(regex, formatVar('pegjs', key));
	}

	fs.writeFileSync(`${gDir}/${lang}/grammar.pegjs`, out, { encoding: 'utf-8' });

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

	console.log(`RECURSE_LEVEL: ${recurseLevel}`);
	if(osis === '2Sam' && recurseLevel == 2) {
		console.log("Break");
	}

	if (recurseLevel > 10) {
		console.log(`Splitting ${osis} by length...`);
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

	console.log(`	 Recurse (${osis}): ${recurseLevel}`);

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
			console.log("Break-2");
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
	gVars['$TEMP_VALUE'] = [value];
	return formatVar(type, '$TEMP_VALUE');
}

function formatVar(type: string, varName: string): string {
	let values: string[] = gVars[varName].slice(); // Assuming `gVars` is an existing object
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
	const lettersFile = fs.readFileSync('letters/letters.txt', 'utf-8');
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
	const blocksFile = fs.readFileSync('letters/blocks.txt', 'utf-8');
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

function getAbbrevs() {
	const out: { [key: string]: { [key: string]: boolean } } = {};
	const fileName = `${gDir}/${lang}/data.txt`;
	let hasCorrections = false;
	try {
		let correctionsFile: fs.WriteStream;
		const fileContent = fs.readFileSync(fileName, { encoding: 'utf-8' });
		const lines = fileContent.split('\n');
		for (const line of lines) {
			if(/^2Chr/.test(line) || /^1Sam/.test(line) || /^2Sam/.test(line)) {
				console.log("Test-001");
			}
			if (/\t\s/.test(line) && /^[^\*]/.test(line)) {
				console.log(`Tab followed by space: ${line}\n`);
			  }
			  if (/\ [\t\n]/.test(line)) {
				console.log(`Space followed by tab/newline: ${line}\n`);
			  }
			  if (!/^[\w\*]/.test(line)) {
				continue;
			  }
			  if (/^\*/.test(line) && /[\[\?!]/.test(line)) {
				console.log(`Regex character in preferred: ${line}\n`);
			  }
			  if (!/\t/.test(line)) {
				continue;
			  }
			let normalized = line.normalize('NFD').normalize('NFC');
			if (normalized !== line) {
				console.log('Non-normalized text');
				hasCorrections = true;
				correctionsFile = fs.createWriteStream('temp.corrections.txt', { encoding: 'utf-8' });
				correctionsFile.write(`${normalized}\n`);
			}
			const isLiteral = /^\*/.test(normalized);
			if (isLiteral) {
				normalized = normalized.replace(/([\x80-\uffff])/u, (match, g1) => `${g1}\``);
			}
			let [osis, ...l_abbrevs] = normalized.split('\t');
			osis = osis.replace(/^\*/, '');
			if(osis === '2Chr' || osis === '1Sam' || osis === '2Sam') {
				console.log("Test-001");
			}
			isValidOsis(osis);
			out[osis] = out[osis] || {};
			out[osis][osis] = true;
			if (/,/.test(osis) || (gVars['$FORCE_OSIS_ABBREV'] && gVars['$FORCE_OSIS_ABBREV'][0] === 'false')) {
				delete out[osis][osis];
			}
			for (let abbrev of l_abbrevs) {
				if (!abbrev.length) {
					continue;
				}
				if (!isLiteral) {
					if (gVars['$PRE_BOOK']) {
						abbrev = `${gVars['$PRE_BOOK'][0]}${abbrev}`;
					}
					if (gVars['$POST_BOOK']) {
						abbrev += gVars['$POST_BOOK'][0];
					}
					gRawAbbrevs[osis] = gRawAbbrevs[osis] || {};
					gRawAbbrevs[osis][abbrev] = true;
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
		if(correctionsFile) correctionsFile.close();
		if (hasCorrections) {
			fs.unlinkSync('temp.corrections.txt');
		}

	} catch (error: any) {
		console.log(`Current Working Dir: ${__dirname}`);
		console.error(`Unexpected Error: ${error.message}`);
		process.exit(4);
	}

	return out;
}

function handleAccents(text: string) {
	const chars = text.split('');
	const texts: string[] = [];
	let context = '';

	while (chars.length) {
		let char = chars.shift();
		const regex = RegExp('^[\x80-\u{10FFFF}]$', 'u');
		if (regex.test(char)) {
			if (chars[0] === '`') {
				texts.push(char, chars.shift());
				continue;
			}
			char = handleAccent(char);
			if (context === '[') {
				char = char.replace(/^\[|\]$/, '');
			}
		} else if (chars[0] === '`') {
			texts.push(char, chars.shift());
			continue;
		} else if (char === '[' && texts.slice(-1)[0] !== '\\') {
			context = '[';
		} else if (char === ']' && texts.slice(-1)[0] !== '\\') {
			context = '';
		}
		texts.push(char);
	}

	text = texts.join('');
	// Replace single quote with a specific Unicode character
	text = text.replace(/'/g, `[\\x{2019}']`);

	// Replace \x{2c8} unless $COLLAPSE_COMBINING_CHARACTERS exists and is set to 'false'
	if (!(gVars['$COLLAPSE_COMBINING_CHARACTERS'] && gVars['$COLLAPSE_COMBINING_CHARACTERS'][0] === 'false')) {
		text = text.replace(/\u{2c8}(?!`)/ug, `[\\x{2c8}']`);
	}

	// Remove the backtick following characters in the range \x80-\x{ffff}
	text = text.replace(/([\x80-\u{10ffff}])`/ug, (match, g1) => `${g1}`);

	// Replace specific Unicode characters with another set
	text = text.replace(/[\u{2b9}\u{374}]/ug, `['\\x{2019}\\x{384}\\x{374}\\x{2b9}]`);

	// Replace a specific pattern with a different pattern involving Unicode characters
	text = text.replace(/([\u{300}\u{370}]-)\['\u{2019}\u{384}\u{374}\u{2b9}\](\u{376})/ug, (match, g1, g2) => `${g1}\\x{374}${g2}`);

	// Replace a period with a regex for optional period, but not followed by a backtick
	text = text.replace(/\.(?!`)/g, '\\.?');

	// Replace period followed by a backtick with an escaped period
	text = text.replace(/\.`/g, '\\.');

	// Replace backtick followed by a space with Unicode character \u2009
	text = text.replace(/ `/g, '\\x{2009}');
	return text;
}

function handleAccent(char: string): string {
	let alt = char.normalize('NFD');
	if (!gVars['$COLLAPSE_COMBINING_CHARACTERS'] || gVars['$COLLAPSE_COMBINING_CHARACTERS'][0] !== 'false') {
		alt = alt.replace(/\p{M}/gu, ''); // remove combining characters
	}
	alt = alt.normalize('NFC');
	if (char !== alt && alt.length > 0 && /[^\s\d]/.test(alt)) {
		return `[${char}${alt}]`;
	}

	char = char.replace(/[\u0660\u06f0\u07c0\u0966\u09e6\u0a66\u0ae6\u0b66\u0be6\u0c66\u0ce6\u0d66\u0e50\u0ed0\u0f20\u1040\u1090\u17e0\u1810\u1946\u19d0\u1a80\u1a90\u1b50\u1bb0\u1c40\u1c50\u{00a620}\u{00a8d0}\u{00a900}\u{00a9d0}\u{00aa50}\u{00abf0}\uff10]/gu, (match, char) => `${char}0`);
	char = char.replace(/[\u0661\u06f1\u07c1\u0967\u09e7\u0a67\u0ae7\u0b67\u0be7\u0c67\u0ce7\u0d67\u0e51\u0ed1\u0f21\u1041\u1091\u17e1\u1811\u1947\u19d1\u1a81\u1a91\u1b51\u1bb1\u1c41\u1c51\u{00a621}\u{00a8d1}\u{00a901}\u{00a9d1}\u{00aa51}\u{00abf1}\uff11]/gu, (match, char) => `${char}1`);
	char = char.replace(/[\u0662\u06f2\u07c2\u0968\u09e8\u0a68\u0ae8\u0b68\u0be8\u0c68\u0ce8\u0d68\u0e52\u0ed2\u0f22\u1042\u1092\u17e2\u1812\u1948\u19d2\u1a82\u1a92\u1b52\u1bb2\u1c42\u1c52\u{00a622}\u{00a8d2}\u{00a902}\u{00a9d2}\u{00aa52}\u{00abf2}\uff12]/gu, (match, char) => `${char}2`);
	char = char.replace(/[\u0663\u06f3\u07c3\u0969\u09e9\u0a69\u0ae9\u0b69\u0be9\u0c69\u0ce9\u0d69\u0e53\u0ed3\u0f23\u1043\u1093\u17e3\u1813\u1949\u19d3\u1a83\u1a93\u1b53\u1bb3\u1c43\u1c53\u{00a623}\u{00a8d3}\u{00a903}\u{00a9d3}\u{00aa53}\u{00abf3}\uff13]/gu, (match, char) => `${char}3`);
	char = char.replace(/[\u0664\u06f4\u07c4\u096a\u09ea\u0a6a\u0aea\u0b6a\u0bea\u0c6a\u0cea\u0d6a\u0e54\u0ed4\u0f24\u1044\u1094\u17e4\u1814\u194a\u19d4\u1a84\u1a94\u1b54\u1bb4\u1c44\u1c54\u{00a624}\u{00a8d4}\u{00a904}\u{00a9d4}\u{00aa54}\u{00abf4}\uff14]/gu, (match, char) => `${char}4`);
	char = char.replace(/[\u0665\u06f5\u07c5\u096b\u09eb\u0a6b\u0aeb\u0b6b\u0beb\u0c6b\u0ceb\u0d6b\u0e55\u0ed5\u0f25\u1045\u1095\u17e5\u1815\u194b\u19d5\u1a85\u1a95\u1b55\u1bb5\u1c45\u1c55\u{00a625}\u{00a8d5}\u{00a905}\u{00a9d5}\u{00aa55}\u{00abf5}\uff15]/gu, (match, char) => `${char}5`);
	char = char.replace(/[\u0666\u06f6\u07c6\u096c\u09ec\u0a6c\u0aec\u0b6c\u0bec\u0c6c\u0cec\u0d6c\u0e56\u0ed6\u0f26\u1046\u1096\u17e6\u1816\u194c\u19d6\u1a86\u1a96\u1b56\u1bb6\u1c46\u1c56\u{00a626}\u{00a8d6}\u{00a906}\u{00a9d6}\u{00aa56}\u{00abf6}\uff16]/gu, (match, char) => `${char}6`);
	char = char.replace(/[\u0667\u06f7\u07c7\u096d\u09ed\u0a6d\u0aed\u0b6d\u0bed\u0c6d\u0ced\u0d6d\u0e57\u0ed7\u0f27\u1047\u1097\u17e7\u1817\u194d\u19d7\u1a87\u1a97\u1b57\u1bb7\u1c47\u1c57\u{00a627}\u{00a8d7}\u{00a907}\u{00a9d7}\u{00aa57}\u{00abf7}\uff17]/gu, (match, char) => `${char}7`);
	char = char.replace(/[\u0668\u06f8\u07c8\u096e\u09ee\u0a6e\u0aee\u0b6e\u0bee\u0c6e\u0cee\u0d6e\u0e58\u0ed8\u0f28\u1048\u1098\u17e8\u1818\u194e\u19d8\u1a88\u1a98\u1b58\u1bb8\u1c48\u1c58\u{00a628}\u{00a8d8}\u{00a908}\u{00a9d8}\u{00aa58}\u{00abf8}\uff18]/gu, (match, char) => `${char}8`);
	char = char.replace(/[\u0669\u06f9\u07c9\u096f\u09ef\u0a6f\u0aef\u0b6f\u0bef\u0c6f\u0cef\u0d6f\u0e59\u0ed9\u0f29\u1049\u1099\u17e9\u1819\u194f\u19d9\u1a89\u1a99\u1b59\u1bb9\u1c49\u1c59\u{00a629}\u{00a8d9}\u{00a909}\u{00a9d9}\u{00aa59}\u{00abf9}\uff19]/gu, (match, char) => `${char}9`);

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

	if (outs.join('').match(/[\[\]]/)) {
		console.error("Unexpected char:", outs);
		throw new Error("Unexpected char");
	}

	return outs;
}

// Helper functions (add appropriate implementations)
// function sortAbbrevsByLength(abbrevs: string[]): string[] {
//     return abbrevs.sort((a, b) => b.length - a.length);
// }

// function sortAbbrevsByLength(strArray: string[]): string[] {
//     // Sort abbreviations by length in descending order, and lexicographically within the same length
//     return strArray.toSorted((a, b) => {
//         const lengthDiff = a.length - b.length;
//         if (lengthDiff !== 0) {
//             return lengthDiff; // Sort by length descending
//         }
//         return a.localeCompare(b); // Sort lexicographically if lengths are equal
//     });
// }

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
	if(/Hab/.test(varName)){
		console.log("Test-001");
	}

	let out: string[] = [];
	let recurse = false;

	// Iterate through each value of the matched variable
	for (const value of gVars[varName] || []) {
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
	if (abbrev.includes('.') && abbrev !== "\\x{418}.\\x{41d}") {
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

function addNonLatinDigitTests(osis: string, args: string[]) {
	const out: any = [];
	const temp = args.join("\n");

	const regex = /[\u0660-\u0669\u06f0-\u06f9\u07c0-\u07c9\u0966-\u096f\u09e6-\u09ef\u0a66-\u0a6f\u0ae6-\u0aef\u0b66-\u0b6f\u0be6-\u0bef\u0c66-\u0c6f\u0ce6-\u0cef\u0d66-\u0d6f\u0e50-\u0e59\u0ed0-\u0ed9\u0f20-\u0f29\u1040-\u1049\u1090-\u1099\u17e0-\u17e9\u1810-\u1819\u1946-\u194f\u19d0-\u19d9\u1a80-\u1a89\u1a90-\u1a99\u1b50-\u1b59\u1bb0-\u1bb9\u1c40-\u1c49\u1c50-\u1c59\uA620-\uA629\uA8d0-\uA8d9\uA900-\uA909\uA9d0-\uA9d9\uAA50-\uAA59\uABF0-\uABF9\uff10-\uff19]/;

	if (!regex.test(temp)) {
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
	const out = [];
	out.push(`\tit "should handle ranges (${lang})", ->`);

	for (const abbrev of gVars["$TO"]) {
		for (const to of expandAbbrev(removeExclamations(handleAccents(abbrev)))) {
			out.push(`\t\texpect(p.parse("Titus 1:1 ${to} 2").osis()).toEqual("Titus.1.1-Titus.1.2", "parsing: 'Titus 1:1 ${to} 2'")`);
			out.push(`\t\texpect(p.parse("Matt 1${to}2").osis()).toEqual("Matt.1-Matt.2", "parsing: 'Matt 1${to}2'")`);
			out.push(`\t\texpect(p.parse("Phlm 2 ${ucNormalize(to)} 3").osis()).toEqual("Phlm.1.2-Phlm.1.3", "parsing: 'Phlm 2 ${ucNormalize(to)} 3'")`);
		}
	}

	return out;
}

function addChapterTests() {
	const out = [];
	out.push(`\tit "should handle chapters (${lang})", ->`);

	for (const abbrev of gVars["$CHAPTER"]) {
		for (const chapter of expandAbbrev(removeExclamations(handleAccents(abbrev)))) {
			out.push(`\t\texpect(p.parse("Titus 1:1, ${chapter} 2").osis()).toEqual("Titus.1.1,Titus.2", "parsing: 'Titus 1:1, ${chapter} 2'")`);
			out.push(`\t\texpect(p.parse("Matt 3:4 ${ucNormalize(chapter)} 6").osis()).toEqual("Matt.3.4,Matt.6", "parsing: 'Matt 3:4 ${ucNormalize(chapter)} 6'")`);
		}
	}

	return out;
}

function addVerseTests() {
	const out = [];
	out.push(`\tit "should handle verses (${lang})", ->`);

	for (const abbrev of gVars["$VERSE"]) {
		for (const verse of expandAbbrev(removeExclamations(handleAccents(abbrev)))) {
			out.push(`\t\texpect(p.parse("Exod 1:1 ${verse} 3").osis()).toEqual("Exod.1.1,Exod.1.3", "parsing: 'Exod 1:1 ${verse} 3'")`);
			out.push(`\t\texpect(p.parse("Phlm ${ucNormalize(verse)} 6").osis()).toEqual("Phlm.1.6", "parsing: 'Phlm ${ucNormalize(verse)} 6'")`);
		}
	}

	return out;
}

function addSequenceTests() {
	const out = [];
	out.push(`\tit "should handle 'and' (${lang})", ->`);

	for (const abbrev of gVars["$AND"]) {
		for (const and of expandAbbrev(removeExclamations(handleAccents(abbrev)))) {
			out.push(`\t\texpect(p.parse("Exod 1:1 ${and} 3").osis()).toEqual("Exod.1.1,Exod.1.3", "parsing: 'Exod 1:1 ${and} 3'")`);
			out.push(`\t\texpect(p.parse("Phlm 2 ${ucNormalize(and)} 6").osis()).toEqual("Phlm.1.2,Phlm.1.6", "parsing: 'Phlm 2 ${ucNormalize(and)} 6'")`);
		}
	}

	return out;
}

function addTitleTests() {
	const out = [];
	out.push(`\tit "should handle titles (${lang})", ->`);

	for (const abbrev of gVars["$TITLE"]) {
		for (const title of expandAbbrev(removeExclamations(handleAccents(abbrev)))) {
			out.push(`\t\texpect(p.parse("Ps 3 ${title}, 4:2, 5:${title}").osis()).toEqual("Ps.3.1,Ps.4.2,Ps.5.1", "parsing: 'Ps 3 ${title}, 4:2, 5:${title}'")`);
			out.push(`\t\texpect(p.parse("${ucNormalize(`Ps 3 ${title}, 4:2, 5:${title}`)}").osis()).toEqual("Ps.3.1,Ps.4.2,Ps.5.1", "parsing: '${ucNormalize(`Ps 3 ${title}, 4:2, 5:${title}`)}'")`);
		}
	}

	return out;
}

function addFfTests() {
	const out = [];
	out.push(`\tit "should handle 'ff' (${lang})", ->`);
	if (lang === 'it') out.push(`\t\tp.set_options {case_sensitive: "books"}`);

	for (const abbrev of gVars["$FF"]) {
		let o_ff = handleAccents(abbrev);
		o_ff = removeExclamations(o_ff);
		const o_ffs = expandAbbrev(o_ff);
		for (const ff of o_ffs) {
			out.push(`\t\texpect(p.parse("Rev 3${ff}, 4:2${ff}").osis()).toEqual("Rev.3-Rev.22,Rev.4.2-Rev.4.11", "parsing: 'Rev 3${ff}, 4:2${ff}'")`);
			if (lang !== 'it') {
				out.push(`\t\texpect(p.parse("${ucNormalize(`Rev 3 ${ff}, 4:2 ${ff}`)}").osis()).toEqual("Rev.3-Rev.22,Rev.4.2-Rev.4.11", "parsing: '${ucNormalize(`Rev 3 ${ff}, 4:2 ${ff}`)}'")`);
			}
		}
	}
	if (lang === 'it') out.push(`\t\tp.set_options {case_sensitive: "none"}`);

	return out;
}

function addNextTests() {
	if (!gVars['$NEXT']) {
		return [];
	}

	const out = [];
	out.push(`\tit "should handle 'next' (${lang})", ->`);
	if (lang === 'it') out.push(`\t\tp.set_options {case_sensitive: "books"}`);

	for (const abbrev of gVars['$NEXT']) {
		for (const next of expandAbbrev(removeExclamations(handleAccents(abbrev)))) {
			out.push(`\t\texpect(p.parse("Rev 3:1${next}, 4:2${next}").osis()).toEqual("Rev.3.1-Rev.3.2,Rev.4.2-Rev.4.3", "parsing: 'Rev 3:1${next}, 4:2${next}'");`);
			if (lang !== 'it') {
				out.push(`\t\texpect(p.parse("${ucNormalize(`Rev 3 ${next}, 4:2 ${next}`)}").osis()).toEqual("Rev.3-Rev.4,Rev.4.2-Rev.4.3", "parsing: '${ucNormalize(`Rev 3 ${next}, 4:2 ${next}`)}'");`);
			}
			out.push(`\t\texpect(p.parse("Jude 1${next}, 2${next}").osis()).toEqual("Jude.1.1-Jude.1.2,Jude.1.2-Jude.1.3", "parsing: 'Jude 1${next}, 2${next}'");`);
			out.push(`\t\texpect(p.parse("Gen 1:31${next}").osis()).toEqual("Gen.1.31-Gen.2.1", "parsing: 'Gen 1:31${next}'");`);
			out.push(`\t\texpect(p.parse("Gen 1:2-31${next}").osis()).toEqual("Gen.1.2-Gen.2.1", "parsing: 'Gen 1:2-31${next}'");`);
			out.push(`\t\texpect(p.parse("Gen 1:2${next}-30").osis()).toEqual("Gen.1.2-Gen.1.3,Gen.1.30", "parsing: 'Gen 1:2${next}-30'");`);
			out.push(`\t\texpect(p.parse("Gen 50${next}, Gen 50:26${next}").osis()).toEqual("Gen.50,Gen.50.26", "parsing: 'Gen 50${next}, Gen 50:26${next}'");`);
			out.push(`\t\texpect(p.parse("Gen 1:32${next}, Gen 51${next}").osis()).toEqual("", "parsing: 'Gen 1:32${next}, Gen 51${next}'");`);
		}
	}

	if (lang === 'it') out.push(`\t\tp.set_options {case_sensitive: "none"}`);
	return out;
}

function addTransTests() {
	const out = [];
	out.push(`\tit "should handle translations (${lang})", ->`);

	for (const abbrev of gVars['$TRANS'].toSorted()) {
		for (const translation of expandAbbrev(removeExclamations(handleAccents(abbrev)))) {
			let [trans, osis] = translation.split(',') || [translation, translation];
			if(!osis) osis = trans;
			out.push(`\t\texpect(p.parse("Lev 1 (${trans})").osis_and_translations()).toEqual [["Lev.1", "${osis}"]]`);
			out.push(`\t\texpect(p.parse("${(`Lev 1 ${trans}`).toLowerCase()}").osis_and_translations()).toEqual [["Lev.1", "${osis}"]]`);
		}
	}

	return out;
}

function addBookRangeTests() {
	const first = expandAbbrev(handleAccents(gVars['$FIRST'][0]))[0];
	const third = expandAbbrev(handleAccents(gVars['$THIRD'][0]))[0];
	let john = '';

	for (const key of Object.keys(gRawAbbrevs['1John']).sort()) {
		if (/^\$FIRST/.test(key)) {
			john = key.replace(/^\$FIRST(?!\w)/, '');
			break;
		}
	}

	if (!john) {
		console.warn("	Warning: no available John abbreviation for testing book ranges");
		return [];
	}

	const out = [];
	const johns = expandAbbrev(handleAccents(john));
	out.push(`\tit "should handle book ranges (${lang})", ->`);
	out.push(`\t\tp.set_options {book_alone_strategy: "full", book_range_strategy: "include"}`);

	const alreadys: Record<string, number> = {};

	for (const abbrev of johns) {
		for (const to_regex of gVars['$TO']) {
			for (const to of expandAbbrev(removeExclamations(handleAccents(to_regex)))) {
				if (!alreadys[`${first} ${to} ${third} ${abbrev}`]) {
					out.push(`\t\texpect(p.parse("${first} ${to} ${third} ${abbrev}").osis()).toEqual("1John.1-3John.1", "parsing: '${first} ${to} ${third} ${abbrev}'")`);
					alreadys[`${first} ${to} ${third} ${abbrev}`] = 1;
				}
			}
		}
	}

	return out;
}

function addBoundaryTests() {
	const out = [];
	out.push(`\tit "should handle boundaries (${lang})", ->`);
	out.push(`\t\tp.set_options {book_alone_strategy: "full"}`);
	out.push(`\t\texpect(p.parse("\\u2014Matt\\u2014").osis()).toEqual("Matt.1-Matt.28", "parsing: '\\u2014Matt\\u2014'")`);
	out.push(`\t\texpect(p.parse("\\u201cMatt 1:1\\u201d").osis()).toEqual("Matt.1.1", "parsing: '\\u201cMatt 1:1\\u201d'")`);
	return out;
}

function removeExclamations(text: string): string {
	if (text.includes('!')) {
		text = text.split('!')[0];
	}
	return text;
}
