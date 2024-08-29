import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';

const lang: string = process.argv[2];

// if (!lang || !/^\w+$/.test(lang)) {
//   console.error('The first argument should be a language iso code (e.g., "fr")');
//   process.exit(1);
// }

// const dir: string = '../src';
// const testDir: string = '../test';
// const regexpSpace: string = '[\\s\\xa0]';
// let validCharacters: string = '[\\d\\s\\xa0.:,;\\x1e\\x1f&\\(\\)\\uff08\\uff09\\[\\]/\\"\'\\*=~\\-\\u2013\\u2014]';
// const letters: string = '';
// const validOsises = makeValidOsises([
//   'Gen', 'Exod', 'Lev', 'Num', 'Deut', 'Josh', 'Judg', 'Ruth', '1Sam', '2Sam', '1Kgs', '2Kgs', '1Chr', '2Chr', 'Ezra', 'Neh', 'Esth',
//   'Job', 'Ps', 'Prov', 'Eccl', 'Song', 'Isa', 'Jer', 'Lam', 'Ezek', 'Dan', 'Hos', 'Joel', 'Amos', 'Obad', 'Jonah', 'Mic', 'Nah', 'Hab', 'Zeph',
//   'Hag', 'Zech', 'Mal', 'Matt', 'Mark', 'Luke', 'John', 'Acts', 'Rom', '1Cor', '2Cor', 'Gal', 'Eph', 'Phil', 'Col', '1Thess', '2Thess',
//   '1Tim', '2Tim', 'Titus', 'Phlm', 'Heb', 'Jas', '1Pet', '2Pet', '1John', '2John', '3John', 'Jude', 'Rev', 'Tob', 'Jdt', 'GkEsth', 'Wis',
//   'Sir', 'Bar', 'PrAzar', 'Sus', 'Bel', 'SgThree', 'EpJer', '1Macc', '2Macc', '3Macc', '4Macc', '1Esd', '2Esd', 'PrMan', 'AddEsth', 'AddDan',
// ]);

// console.log("Here-1");

// const rawAbbrevs: any = {};
// const vars = getVars();
// console.log("Here-2");
// const abbrevs: any = getAbbrevs();
// console.log("Here-3");
// const order = getOrder();
// console.log("Here-4");
// const allAbbrevs: { [key: string]: string[] } = makeTests();
// console.log("Here-5");
// makeRegexps();
// makeGrammar();
// const defaultAlternatesFile = `${dir}/en/translation_alternates.coffee`;
// makeTranslations();


// function makeTranslations() {
//     let out = getFileContents(`${dir}/template/translations.coffee`);
//     const regexps: string[] = [];
//     const aliases: string[] = [];

//     for (const translation of vars['$TRANS']) {
//         const [trans, osis, alias] = translation.split(',');
//         regexps.push(trans);

//         if (osis || alias) {
//             const effectiveAlias = alias || 'default';
//             let lc = trans.toLowerCase();
//             lc = /[\W]/.test(lc) ? `"${lc}"` : lc;

//             let string = `${lc}:`;
//             if (osis) {
//                 string += `\n\t\t\tosis: "${osis}"`;
//             }
//             if (effectiveAlias) {
//                 string += `\n\t\t\talias: "${effectiveAlias}"`;
//             }
//             aliases.push(string);
//         }
//     }

//     const regexp = makeBookRegexp('translations', regexps, 1);
//     let alias = aliases.join('\n\t\t');

//     const translationAliasesPath = `${dir}/${lang}/translation_aliases.coffee`;
//     if (fs.existsSync(translationAliasesPath)) {
//         alias = getFileContents(translationAliasesPath);
//         out = out.replace(/\t+(\$TRANS_ALIAS)/g, '$1');
//     }

//     let alternate = getFileContents(defaultAlternatesFile);
//     const translationAlternatesPath = `${dir}/${lang}/translation_alternates.coffee`;
//     if (fs.existsSync(translationAlternatesPath)) {
//         alternate = getFileContents(translationAlternatesPath);
//     }

//     out = out.replace(/\$TRANS_REGEXP/g, regexp)
//              .replace(/\$TRANS_ALIAS/g, alias)
//              .replace(/\s*\$TRANS_ALTERNATE/g, `\n${alternate}`);

//     const langIsos = JSON.parse(vars['$LANG_ISOS']);
//     out = out.replace(/\$LANG_ISOS/g, langIsos);

//     fs.writeFileSync(`${dir}/${lang}/translations.coffee`, out, { encoding: 'utf-8'});

//     if (/\$[A-Z_]+/.test(out)) {
//         throw new Error('Translations: Capital variable');
//     }
// }


// function makeGrammar() {
//   let out = getFileContents(`${dir}/template/grammar.pegjs`);

//   if (!vars['$NEXT']) {
//       out = out.replace(/\nnext_v\s+=.+\s+\{ return[^\}]+\}\s+\}\s+/, '\n');
//       out = out.replace(/\bnext_v \/ /g, '');
//       out = out.replace(/\$NEXT \/ /g, '');
//       if (/\bnext_v\b|\$NEXT/.test(out)) {
//           throw new Error('Grammar: next_v');
//       }
//   }

//   for (const key of Object.keys(vars).sort()) {
//       const safeKey = key.replace(/^\$/, '\\$');
//       const regex = new RegExp(`${safeKey}\\b`, 'g');
//       out = out.replace(regex, formatVar('pegjs', key));
//   }

//   fs.writeFileSync(`${dir}/${lang}/grammar.pegjs`, out, { encoding: 'utf8' });

//   const match = out.match(/\$[A-Z_]+/);
//   if (match) {
//       throw new Error(`${match[0]}\nGrammar: Capital variable`);
//   }
// }

// function makeRegexps() {
//   let out = getFileContents(`${dir}/template/regexps.coffee`);

//   if (!vars['$NEXT']) {
//       out = out.replace(/\n.+\$NEXT.+\n/, '\n');
//       if (/\$NEXT\b/.test(out)) {
//           throw new Error('Regexps: next');
//       }
//   }

//   const osises = [...order];
//   for (const osis of Object.keys(rawAbbrevs).sort()) {
//       if (!osis.includes(',')) continue;

//       let temp = osis.replace(/,+$/, '');
//       const apocrypha = (validOsises[temp] && validOsises[temp] === 'apocrypha') ? true : false;
//       osises.push({ osis, apocrypha });
//   }

//   const bookRegexps = makeRegexpSet(osises);
//   out = out.replace(/\$BOOK_REGEXPS/g, bookRegexps);
//   out = out.replace(/\$VALID_CHARACTERS/g, validCharacters);

//   const prePassageAllowedCharacters = vars['$PRE_PASSAGE_ALLOWED_CHARACTERS'].join('|');
//   out = out.replace(/\$PRE_PASSAGE_ALLOWED_CHARACTERS/g, prePassageAllowedCharacters);

//   const pre = vars['$PRE_BOOK_ALLOWED_CHARACTERS'].map((char: any) => formatValue('quote', char)).join('|');
//   out = out.replace(/\$PRE_BOOK_ALLOWED_CHARACTERS/g, pre);

//   const passageComponents: string[] = [];
//   for (const varName of ['$CHAPTER', '$NEXT', '$FF', '$TO', '$AND', '$VERSE']) {
//       if (vars[varName]) {
//           passageComponents.push(...vars[varName].map((value: any) => formatValue('regexp', value)));
//       }
//   }

//   passageComponents.sort((a, b) => b.length - a.length);
//   out = out.replace(/\$PASSAGE_COMPONENTS/g, passageComponents.join(' | '));

//   for (const key of Object.keys(vars).sort()) {
//       const safeKey = key.replace(/^\$/, '\\$');
//       const regex = new RegExp(`${safeKey}(?!\\w)`, 'g');
//       out = out.replace(regex, formatVar('regexp', key));
//   }

//   fs.writeFileSync(`${dir}/${lang}/regexps.coffee`, out, { encoding: 'utf8' });

//   const match = out.match(/\$[A-Z_]+/);
//   if (match) {
//       throw new Error(`${match[0]}\nRegexps: Capital variable`);
//   }
// }

// function makeRegexpSet(refs: any): string {
//   const out = [];
//   let hasPsalmCb = false;

//   for (const ref of refs) {
//       const { osis, apocrypha } = ref;

//       if (osis === 'Ps' && !hasPsalmCb && fileExists(`${dir}/${lang}/psalm_cb.coffee`)) {
//           out.push(getFileContents(`${dir}/${lang}/psalm_cb.coffee`));
//           hasPsalmCb = true;
//       }

//       const safes: { [abbrev: string]: number } = {};
//       for (const abbrev of Object.keys(rawAbbrevs[osis])) {
//           let safe = abbrev.replace(/[\[\]\?]/g, '');
//           safes[abbrev] = safe.length;
//       }

//       const sortedSafes = Object.keys(safes).sort((a, b) => safes[b] - safes[a]);
//       out.push(makeRegexp(osis, apocrypha, ...sortedSafes));
//   }

//   return out.join("\x0a\t,\x0a");
// }

// // Utility function to check if a file exists (to replicate `-f` operator in Perl)
// function fileExists(path: string): boolean {
//   try {
//       // Assuming a Node.js environment where `fs` module can be used
//       const fs = require('fs');
//       return fs.existsSync(path);
//   } catch (err) {
//       return false;
//   }
// }

// function makeRegexp(osis: string, apocrypha: boolean, ...abbrevs: string[]): string {
//   const out: string[] = [];
//   const abbrevList: string[] = [];

//   for (let abbrev of abbrevs) {
//       abbrev = abbrev.replace(/ /g, `${regexpSpace}*`);
//       abbrev = abbrev.replace(/[\u200B]/g, () => {
//           let temp = regexpSpace;
//           temp = temp.replace(/\]$/, '\u200B]');
//           return `${temp}*`;
//       });
//       abbrev = handleAccents(abbrev);
//       abbrev = abbrev.replace(/(\$[A-Z]+)(?!\w)/g, (match) => formatVar('regexp', match) + "\\.?");
//       abbrevList.push(abbrev);
//   }

//   const bookRegexp = makeBookRegexp(osis, allAbbrevs[osis], 1);
//   osis = osis.replace(/,+$/, '');
//   osis = osis.replace(/,/g, '", "');
//   out.push(`\t\tosis: ["${osis}"]\x0a\t\t`);

//   if (apocrypha) {
//       out.push("apocrypha: true\x0a\t\t");
//   }

//   let pre = '#{bcv_parser::regexps.pre_book}';
//   if (/^[0-9]/.test(osis) || /[0-9]/.test(abbrevList.join('|'))) {
//       pre = vars['$PRE_BOOK_ALLOWED_CHARACTERS'].map((char: string) => formatValue('quote', char)).join('|');
//       if (pre === "\\\\d|\\\\b") {
//           pre = '\\b';
//       }
//       pre = pre.replace(/\\+d\|?/g, '');
//       pre = pre.replace(/^\|+/, '');
//       pre = pre.replace(/^\||\|\||\|$/g, ''); // remove leftover |
//       pre = pre.replace(/^\[\^/g, '[^0-9'); // if it's a negated class, add \d
//   }

//   const post = vars['$POST_BOOK_ALLOWED_CHARACTERS'].join('|');
//   out.push(`regexp: ///(^|${pre})(\x0a\t\t`);
//   out.push(bookRegexp);
//   out[out.length - 1] = out[out.length - 1].replace(/-(?!\?)/g, '-?');
//   out.push(`\x0a\t\t\t)(?:(?=${post})|\\$)///gi`);

//   return out.join("");
// }

// function makeBookRegexp(osis: string, abbrevs: string[], recurseLevel: number): string {
//   // Remove backslashes from each abbreviation
//   abbrevs.forEach((abbrev, index) => {
//       abbrevs[index] = abbrev.replace(/\\/g, '');
//   });

//   // Get subsets of the book abbreviations
//   const subsets = getBookSubsets(abbrevs);
//   const out: string[] = [];
//   let i = 1;

//   for (const subset of subsets) {
//       const json = JSON.stringify(subset);
//       let base64 = Buffer.from(json).toString('base64');
//       console.log(`${osis} ${base64.length}`);

//       let useFile = false;

//       if (base64.length > 128_000) { // Ubuntu limitation
//           useFile = true;
//           const fs = require('fs');
//           fs.writeFileSync('./temp.txt', json);
//           base64 = '<';
//       }

//       const { execSync } = require('child_process');
//       let regexp = execSync(`node ./make_regexps.js "${base64}"`).toString();

//       if (useFile) {
//           const fs = require('fs');
//           fs.unlinkSync('./temp.txt');
//       }

//       regexp = JSON.parse(regexp);
//       if (!regexp.patterns) {
//           throw new Error("No regexp JSON object");
//       }

//       const patterns = regexp.patterns.map((pattern: string) => formatNodeRegexpPattern(pattern));
//       let pattern = patterns.join('|');
//       pattern = validateNodeRegexp(osis, pattern, subset, recurseLevel);
//       out.push(pattern);
//   }

//   validateFullNodeRegexp(osis, out.join('|'), abbrevs);
//   return out.join('|');
// }

// function validateFullNodeRegexp(osis: string, pattern: string, abbrevs: string[]): void {
//   abbrevs.forEach(abbrev => {
//       let compare = `${abbrev} 1`;
//       const regex = new RegExp(`^(?:${pattern}) `);
//       compare = compare.replace(regex, '');
//       if (compare !== '1') {
//           console.error(`  Not parsable (${abbrev}): '${compare}'\n${pattern}`);
//       }
//   });
// }

// function getBookSubsets(abbrevs: string[]): string[][] {
//   if (abbrevs.length <= 20) {
//       return [abbrevs];
//   }

//   const groups: string[][] = [[]];
//   const subs: { [key: string]: number } = {};

//   // Sort abbreviations by length in descending order
//   abbrevs.sort((a, b) => b.length - a.length);

//   while (abbrevs.length > 0) {
//       const long = abbrevs.shift()!;
//       if (subs[long]) continue;

//       for (let i = 0; i < abbrevs.length; i++) {
//           const short = abbrevs[i];
//           const regex = new RegExp(`(?:^|[\\s\\p{Punct}])${escapeRegExp(short)}(?:[\\s\\p{Punct}]|$)`, 'i');
//           if (regex.test(long)) {
//               subs[short] = (subs[short] || 0) + 1;
//           }
//       }
//       groups[0].push(long);
//   }

//   if (Object.keys(subs).length > 0) {
//       groups[1] = Object.keys(subs).sort((a, b) => b.length - a.length);
//   }

//   return groups;
// }

// // Helper function to escape special characters in regex patterns
// function escapeRegExp(string: string): string {
//   return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// }

// function consolidateAbbrevs(...refs: { [key: string]: any }[]): string[][] {
//   const out: string[][] = [];
//   let mergeIndex: number = -1;

//   while (refs.length > 0) {
//       const ref = refs.shift()!;
//       if (Object.keys(ref).length === 2) {
//           if (mergeIndex === -1) {
//               mergeIndex = out.length;
//               out.push(Object.keys(ref));
//           } else {
//               for (const abbrev of Object.keys(ref)) {
//                   out[mergeIndex].push(abbrev);
//               }
//               if (out[mergeIndex].length > 6) {
//                   mergeIndex = -1;
//               }
//           }
//       } else {
//           out.push(Object.keys(ref));
//       }
//   }

//   return out;
// }

// function validateNodeRegexp(
//   osis: string,
//   pattern: string,
//   abbrevs: string[],
//   recurseLevel: number,
//   note?: string
// ): string {
//   const [oks, notOks] = checkRegexpPattern(osis, pattern, abbrevs);

//   if (notOks.length === 0) {
//       return pattern;
//   }

//   console.log(`RECURSE_LEVEL: ${recurseLevel}`);

//   if (recurseLevel > 10) {
//       console.log(`Splitting ${osis} by length...`);
//       if (note === 'lengths') {
//           throw new Error(`'Lengths' didn't work: ${osis}`);
//       }

//       const lengths = splitByLength(...abbrevs);
//       const patterns: string[] = [];

//       for (const length of Object.keys(lengths).sort((a, b) => Number(b) - Number(a))) {
//           patterns.push(makeBookRegexp(osis, lengths[length as any], 1));
//       }

//       return validateNodeRegexp(osis, patterns.join('|'), abbrevs, recurseLevel + 1, 'lengths');
//   }

//   console.log(`  Recurse (${osis}): ${recurseLevel}`);

//   const okPattern = makeBookRegexp(osis, oks, recurseLevel + 1);
//   const notOkPattern = makeBookRegexp(osis, notOks, recurseLevel + 1);

//   const shortestOk = oks.sort((a, b) => a.length - b.length)[0];
//   const shortestNotOk = notOks.sort((a, b) => a.length - b.length)[0];

//   let newPattern = (shortestOk.length > shortestNotOk.length && recurseLevel < 10)
//       ? `${okPattern}|${notOkPattern}`
//       : `${notOkPattern}|${okPattern}`;

//   return validateNodeRegexp(osis, newPattern, abbrevs, recurseLevel + 1, 'final');
// }

// function splitByLength(...abbrevs: string[]): { [key: number]: string[] } {
//   const lengths: { [key: number]: string[] } = {};

//   for (const abbrev of abbrevs) {
//       const length = Math.floor(abbrev.length / 2);
//       if (!lengths[length]) {
//           lengths[length] = [];
//       }
//       lengths[length].push(abbrev);
//   }

//   return lengths;
// }

// function checkRegexpPattern(
//   osis: string,
//   pattern: string,
//   abbrevs: string[]
// ): [string[], string[]] {
//   const oks: string[] = [];
//   const notOks: string[] = [];

//   for (const abbrev of abbrevs) {
//       let compare = `${abbrev} 1`;
//       compare = compare.replace(new RegExp(`^(?:${pattern})`, 'i'), '');
//       if (compare !== ' 1') {
//           notOks.push(abbrev);
//       } else {
//           oks.push(abbrev);
//       }
//   }

//   return [oks, notOks];
// }

// function formatNodeRegexpPattern(pattern: string): string {
//   if (!/^\/\^/.test(pattern) || !/\/$/.test(pattern)) {
//       throw new Error(`Unexpected regexp pattern: ${pattern}`);
//   }

//   pattern = pattern.slice(2, -2);

//   if (pattern.includes('[')) {
//       const parts = pattern.split('[');
//       const out: string[] = [parts.shift()!];
//       while (parts.length > 0) {
//           let part = parts.shift()!;
//           if (out[out.length - 1].endsWith('\\')) {
//               out[out.length - 1] += part;
//               continue;
//           }
//           if (!/[- ]/.test(part)) {
//               out.push(part);
//               continue;
//           }

//           let hasSpace = false;
//           const chars = part.split('');
//           const outChars: string[] = [];
//           while (chars.length > 0) {
//               const char = chars.shift()!;
//               if (char === '\\') {
//                   outChars.push(char, chars.shift()!);
//               } else if (char === '-') {
//                   outChars.push('\\-');
//               } else if (char === ']') {
//                   outChars.push(char);
//                   if (hasSpace && (chars.length === 0 || !/^[*+]/.test(chars[0]))) {
//                       outChars.push('*');
//                   }
//                   outChars.push(...chars);
//                   break;
//               } else if (char === ' ') {
//                   outChars.push('::OPTIONAL_SPACE::');
//                   hasSpace = true;
//               } else {
//                   outChars.push(char);
//               }
//           }
//           part = outChars.join('');
//           out.push(part);
//       }

//       pattern = out.join('[');
//   }

//   pattern = pattern.replace(/ /g, '[\\s\\xa0]*');
//   pattern = pattern.replace(/::OPTIONAL_SPACE::/g, '\\s\\xa0');
//   pattern = pattern.replace(/\u2009/g, '[\\s\\xa0]');

//   return pattern;
// }

// function formatValue(type: string, value: string): string {
//   vars['$TEMP_VALUE'] = [value];
//   return formatVar(type, '$TEMP_VALUE');
// }

// function formatVar(type: string, varName: string): string {
//   const values = vars[varName];
//   if (!values) throw new Error(`Variable ${varName} not found`);

//   if (type === 'regexp' || type === 'quote') {
//       for (let i = 0; i < values.length; i++) {
//           let value = values[i];
//           value = value.replace(/\.$/, '');
//           value = value.replace(/!(.+)$/, '(?!$1)');
//           if (type === 'quote') {
//               value = value.replace(/\\/g, '\\\\');
//               value = value.replace(/"/g, '\\"');
//           }
//           values[i] = value;
//       }

//       let out = values.join('|');
//       out = handleAccents(out);
//       out = out.replace(/ +/, `#{bcv_parser::regexps.space}+`);

//       return values.length > 1 ? `(?:${out})` : out;
//   } else if (type === 'pegjs') {
//       for (let i = 0; i < values.length; i++) {
//           let value = values[i];
//           value = value.replace(/\.(?!`)/g, ' abbrev? ');
//           value = value.replace(/\.`/g, ' abbrev ');
//           value = value.toLowerCase();
//           value = handleAccents(value);
//           value = value.replace(/\[/g, '" [');
//           value = value.replace(/\]/g, '] "');
//           value = `"${value}"`;
//           value = value.replace(/\s*!\[/g, ' " ![');
//           value = value.replace(/\s*!([^\[])/g, ' " !"$1');
//           value = value.replace(/"{2,}/g, '');
//           value = value.trim();
//           value += ' ';
//           let out: string[] = [];
//           const parts = value.split('"');
//           let isOutsideQuote = true;

//           while (parts.length > 0) {
//               let part = parts.shift()!;
//               if (!isOutsideQuote) {
//                   part = part.replace(/^ /, () => out[out.length - 1] += 'space ' || '');
//                   part = part.replace(/ /g, ' " space "');
//                   part = part.replace(/((?:^|")[^"]+?")( space )/g, (match: any, quote: any, space: any) => {
//                       if (/[^\x00-\x7F]/.test(quote)) {
//                           quote += 'i';
//                       }
//                       return `${quote}${space}`;
//                   });
//                   out.push(part);
//                   if (parts[0]) {
//                       parts[0] = 'i' + parts[0];
//                   }
//                   isOutsideQuote = true;
//               } else {
//                   out.push(part);
//                   isOutsideQuote = false;
//               }
//           }
//           value = out.join('"');
//           value = value.replace(/\[([^\]]*?[\x80-\uffff][^\]]*?)\]/g, '[$1]i');
//           value = value.replace(/!(space ".+)/g, '!($1)');
//           value = value.trim();
//           if (varName === '$TO') {
//               value += ' sp';
//           }
//           values[i] = value;
//       }

//       let out = values.join(' / ');
//       if ((varName === '$TITLE' || varName === '$NAMETITLE') && !vars['$URL']) {
//           out = out.replace(/\( /g, '\\s ');
//       }
//       return out;
//   } else {
//       throw new Error(`Unknown type: ${type}`);
//   }
// }


// function makeValidOsises(osises: string[]) {
//   const out: any = {};
//   let type: string = 'ot_nt';

//   for (const osis of osises) {
//     if (osis === 'Tob') {
//       type = 'apocrypha';
//     }
//     out[osis] = type;
//   }

//   return out;
// }

// function ucNormalize(text: string): string {
//   return text.normalize('NFC').toUpperCase();
// }

// function getFileContents(filePath: string): string {
//   try {
//     return fs.readFileSync(filePath, 'utf8');
//   } catch (error: any) {
//     throw new Error(`Couldn't open ${filePath}: ${error.message}`);
//   }
// }

// function getVars(): { [key: string]: any } {
//   const out: { [key: string]: any } = {};
//   console.log(`File name: ${path.join(__dirname, lang)}/data.txt, current dir: ${__dirname}`);

//   try {
//     const fileContent = fs.readFileSync(path.join(dir, lang, 'data.txt'), 'utf8');
//     const lines = fileContent.split('\n');
//     for (const line of lines) {
//       if (line.startsWith('$')) {
//         const [key, ...values] = line.trim().split('\t');
//         if (!values.length) {
//           throw new Error(`No values for ${key}`);
//         }
//         out[key] = values;
//       }
//     }
//   } catch (error: any) {
//     throw new Error(`Incorrect file: ${error.message}`);
//   }

//   if (out['$ALLOWED_CHARACTERS']) {
//     for (const char of out['$ALLOWED_CHARACTERS']) {
//       const check = escapeRegExp(char);
//       if (!validCharacters.includes(check)) {
//         validCharacters += char;
//       }
//     }
//   }

//   out['$PRE_BOOK_ALLOWED_CHARACTERS'] = [getPreBookCharacters(out['$UNICODE_BLOCK'])];
//   out['$POST_BOOK_ALLOWED_CHARACTERS'] = [validCharacters];
//   out['$PRE_PASSAGE_ALLOWED_CHARACTERS'] = [getPrePassageCharacters(out['$PRE_BOOK_ALLOWED_CHARACTERS'])];
//   out['$LANG'] = [lang];
//   out['$LANG_ISOS'] = [lang];

//   return out;
// }

// function getPrePassageCharacters(pattern: string[]): string {
//   const joinedPattern = pattern.join('|');
//   if (joinedPattern.match(/^\[\^[^\]]+?\]$/)) {
//     return joinedPattern
//       .replace(/`/g, '')
//       .replace(/\\x1[ef]|0-9|\\d|A-Z|a-z/g, '')
//       .replace(/\[\^/g, '[^\\x1f\\x1e\\dA-Za-z');
//   } else if (joinedPattern === '\\d|\\b') {
//     return '[^\\w\\x1f\\x1e]';
//   } else {
//     throw new Error(`Unknown pre_passage pattern: ${joinedPattern}`);
//   }
// }

// function getPreBookCharacters(unicodeBlock: string[]): string {
//   if (!unicodeBlock) {
//     throw new Error('No $UNICODE_BLOCK is set');
//   }
//   const blocks = getUnicodeBlocks(unicodeBlock);
//   const letters = getLetters(blocks);
//   const outArray: string[] = [];
//   for (const letter of letters) {
//     const [start, end] = letter;
//     outArray.push(end === start ? start : `${start}-${end}`);
//   }
//   const out = outArray.join('');
//   return `[${out.replace(/([\x80-\uffff])/g, '$1`')}]`;
// }

// function getLetters(blocks: [number, number][]): [string, string][] {
//   const out: { [key: number]: boolean } = {};
//   const lettersFile = fs.readFileSync('letters/letters.txt', 'utf8');
//   const lines = lettersFile.split('\n');
//   for (const line of lines) {
//     if (line.startsWith('\\u')) {
//       const [start, end] = line.trim().replace(/\\u/g, '').replace(/\s*#.+/g, '').replace(/\s+/g, '').split('-');
//       const startHex = parseInt(start, 16);
//       const endHex = parseInt(end || start, 16);
//       for (const block of blocks) {
//         const [startRange, endRange] = block;
//         if (endHex >= startRange && startHex <= endRange) {
//           for (let i = startHex; i <= endHex; i++) {
//             if (i >= startRange && i <= endRange) {
//               out[i] = true;
//             }
//           }
//         }
//       }
//     }
//   }

//   const sortedKeys = Object.keys(out).sort((a, b) => parseInt(a) - parseInt(b));
//   const outArray: [string, string][] = [];
//   let prev = -2;
//   for (const key of sortedKeys) {
//     if (parseInt(key) === prev + 1) {
//       outArray[outArray.length - 1][1] = String.fromCharCode(parseInt(key));
//     } else {
//       outArray.push([String.fromCharCode(parseInt(key)), String.fromCharCode(parseInt(key))]);
//     }
//     prev = parseInt(key);
//   }
//   return outArray;
// }

// function getUnicodeBlocks(unicodeBlock: string[]): [number, number][] {
//   let unicode = unicodeBlock.join('|');
//   if (!unicode.includes('Basic_Latin')) {
//     unicode += '|Basic_Latin';
//   }
//   const out: [number, number][] = [];
//   const blocksFile = fs.readFileSync('letters/blocks.txt', 'utf8');
//   const lines = blocksFile.split('\n');
//   for (const line of lines) {
//     if (line.match(/^\w/)) {
//       const [block, range] = line.trim().split('\t');
//       if (block.match(new RegExp(unicode))) {
//         const [start, end] = range.replace(/\\u/g, '').split('-');
//         out.push([parseInt(start, 16), parseInt(end, 16)]);
//       }
//     }
//   }
//   return out;
// }

// function getAbbrevs() {
//   const out: { [key: string]: { [key: string]: boolean } } = {};
//   let hasCorrections = false;
//   const correctionsFile = fs.createWriteStream('temp.corrections.txt', { encoding: 'utf8' });
//   const fileContent = fs.readFileSync(`${dir}/${lang}/data.txt`, 'utf8');
//   const lines = fileContent.split('\n');
//   for (const line of lines) {
//     if (line.includes('\t ') && !line.startsWith('*')) {
//       console.log(`Tab followed by space: ${line}`);
//     }
//     if (line.includes(' \t') || line.includes(' \n')) {
//       console.log(`Space followed by tab/newline: ${line}`);
//     }
//     if (!line.match(/^[^\*]/)) {
//       continue;
//     }
//     if (line.startsWith('*') && line.includes('[\\?!]')) {
//       console.log(`Regex character in preferred: ${line}`);
//     }
//     if (!line.includes('\t')) {
//       continue;
//     }
//     const prev = line;
//     const normalized = line.normalize('NFC');
//     if (normalized !== prev) {
//       console.log('Non-normalized text');
//       hasCorrections = true;
//       correctionsFile.write(`${normalized}\n`);
//     }
//     const isLiteral = line.startsWith('*');
//     const [osis, ...abbrevs] = line.split('\t');
//     osis.replace(/^\*/, '');
//     isValidOsis(osis);
//     out[osis] = out[osis] || {};
//     out[osis][osis] = true;
//     for (let abbrev of abbrevs) {
//       if (!abbrev.length) {
//         continue;
//       }
//       if (!isLiteral) {
//         if (vars['$PRE_BOOK']) {
//           abbrev = vars['$PRE_BOOK'][0] + abbrev;
//         }
//         if (vars['$POST_BOOK']) {
//           abbrev += vars['$POST_BOOK'][0];
//         }
//         rawAbbrevs[osis] = rawAbbrevs[osis] || {};
//         rawAbbrevs[osis][abbrev] = true;
//       }
//       const handled = handleAccents(abbrev);
//       const alts = expandAbbrevVars(handled);
//       for (const alt of alts) {
//         if (alt.includes('[\\?]')) {
//           for (const expanded of expandAbbrev(alt)) {
//             out[osis][expanded] = true;
//           }
//         } else {
//           out[osis][alt] = true;
//         }
//       }
//     }
//   }
//   correctionsFile.close();
//   if (!hasCorrections) {
//     fs.unlinkSync('temp.corrections.txt');
//   }
//   return out;
// }

// function handleAccents(text: string) {
//   const chars = text.split('');
//   const texts: string[] = [];
//   let context = '';
//   while (chars.length) {
//     let char = chars.shift() as string;
//     if (/^[\x80-\uffff]$/.test(char)) {
//       if (chars[0] === '`') {
//         texts.push(char, chars.shift() as string);
//         continue;
//       }
//       char = handleAccent(char);
//       if (context === '[') {
//         char = char.replace(/^\[|\]$/, '');
//       }
//     } else if (chars[0] === '`') {
//       texts.push(char, chars.shift() as string);
//       continue;
//     } else if (char === '[' && texts.slice(-1)[0] !== '\\') {
//       context = '[';
//     } else if (char === ']' && texts.slice(-1)[0] !== '\\') {
//       context = '';
//     }
//     texts.push(char);
//   }
//   text = texts.join('');
//   text = text.replace(/'/g, `[\u2019']`);
//   text = text.replace(/\u02C8(?!`)/g, `[\u02C8']`,);
//   if (!vars['$COLLAPSE_COMBINING_CHARACTERS'] || vars['$COLLAPSE_COMBINING_CHARACTERS'][0] !== 'false') {
//     text = text.replace(/([\x80-\uffff])`/g, '$1');
//   }
//   text = text.replace(/[\u02B9\u0374]/g, `['\u2019\u0384\u0374\u02B9']`);
//   text = text.replace(/([\u0300\u0370])-['\u2019\u0384\u0374\u02B9](\u0376)/g, '$1\u0374$2');
//   text = text.replace(/\.(?!`)/g, '\\.?');
//   text = text.replace(/\.`/g, '\\.');
//   text = text.replace(/ `/g, '\u2009');
//   return text;
// }

// function handleAccent(char: string): string {
//   let alt = char.normalize('NFD');
//   if (!vars['$COLLAPSE_COMBINING_CHARACTERS'] || vars['$COLLAPSE_COMBINING_CHARACTERS'][0] !== 'false') {
//     alt = alt.replace(/\p{M}/gu, ''); // remove combining characters
//   }
//   alt = alt.normalize('NFC');
//   if (char !== alt && alt.length > 0 && /[^\s\d]/.test(alt)) {
//     return `[${char}${alt}]`;
//   }
//   char = char.replace(/[\u0660\u06f0\u07c0\u0966\u09e6\u0a66\u0ae6\u0b66\u0be6\u0c66\u0ce6\u0d66\u0e50\u0ed0\u0f20\u1040\u1090\u17e0\u1810\u1946\u19d0\u1a80\u1a90\u1b50\u1bb0\u1c40\u1c50\ua620\ua8d0\ua900\ua9d0\uaa50\uabf0\uff10]/g, `[$&0]`);
//   char = char.replace(/[\u0661\u06f1\u07c1\u0967\u09e7\u0a67\u0ae7\u0b67\u0be7\u0c67\u0ce7\u0d67\u0e51\u0ed1\u0f21\u1041\u1091\u17e1\u1811\u1947\u19d1\u1a81\u1a91\u1b51\u1bb1\u1c41\u1c51\ua621\ua8d1\ua901\ua9d1\uaa51\uabf1\uff11]/g, `[$&1]`);
//   char = char.replace(/[\u0662\u06f2\u07c2\u0968\u09e8\u0a68\u0ae8\u0b68\u0be8\u0c68\u0ce8\u0d68\u0e52\u0ed2\u0f22\u1042\u1092\u17e2\u1812\u1948\u19d2\u1a82\u1a92\u1b52\u1bb2\u1c42\u1c52\ua622\ua8d2\ua902\ua9d2\uaa52\uabf2\uff12]/g, `[$&2]`);
//   char = char.replace(/[\u0663\u06f3\u07c3\u0969\u09e9\u0a69\u0ae9\u0b69\u0be9\u0c69\u0ce9\u0d69\u0e53\u0ed3\u0f23\u1043\u1093\u17e3\u1813\u1949\u19d3\u1a83\u1a93\u1b53\u1bb3\u1c43\u1c53\ua623\ua8d3\ua903\ua9d3\uaa53\uabf3\uff13]/g, `[$&3]`);
//   char = char.replace(/[\u0664\u06f4\u07c4\u096a\u09ea\u0a6a\u0aea\u0b6a\u0bea\u0c6a\u0cea\u0d6a\u0e54\u0ed4\u0f24\u1044\u1094\u17e4\u1814\u194a\u19d4\u1a84\u1a94\u1b54\u1bb4\u1c44\u1c54\ua624\ua8d4\ua904\ua9d4\uaa54\uabf4\uff14]/g, `[$&4]`);
//   char = char.replace(/[\u0665\u06f5\u07c5\u096b\u09eb\u0a6b\u0aeb\u0b6b\u0beb\u0c6b\u0ceb\u0d6b\u0e55\u0ed5\u0f25\u1045\u1095\u17e5\u1815\u194b\u19d5\u1a85\u1a95\u1b55\u1bb5\u1c45\u1c55\ua625\ua8d5\ua905\ua9d5\uaa55\uabf5\uff15]/g, `[$&5]`);
//   char = char.replace(/[\u0665\u06f5\u07c5\u096b\u09eb\u0a6b\u0aeb\u0b6b\u0beb\u0c6b\u0ceb\u0d6b\u0e55\u0ed5\u0f25\u1045\u1095\u17e5\u1815\u194b\u19d5\u1a85\u1a95\u1b55\u1bb5\u1c45\u1c55\ua625\ua8d5\ua905\ua9d5\uaa55\uabf5\uff15]/g, `[$&5]`);
//   char = char.replace(/[\u0665\u06f5\u07c5\u096b\u09eb\u0a6b\u0aeb\u0b6b\u0beb\u0c6b\u0ceb\u0d6b\u0e55\u0ed5\u0f25\u1045\u1095\u17e5\u1815\u194b\u19d5\u1a85\u1a95\u1b55\u1bb5\u1c45\u1c55\ua625\ua8d5\ua905\ua9d5\uaa55\uabf5\uff15]/g, `[$&5]`);
//   char = char.replace(/[\u0665\u06f5\u07c5\u096b\u09eb\u0a6b\u0aeb\u0b6b\u0beb\u0c6b\u0ceb\u0d6b\u0e55\u0ed5\u0f25\u1045\u1095\u17e5\u1815\u194b\u19d5\u1a85\u1a95\u1b55\u1bb5\u1c45\u1c55\ua625\ua8d5\ua905\ua9d5\uaa55\uabf5\uff15]/g, `[$&5]`);
//   return char;
// }

// function isNextCharOptional(chars: string[]): [boolean, string[]] {
//   let isOptional = false;
//   if (chars.length > 0 && chars[0] === '?') {
//       chars.shift();  // Remove the first element
//       isOptional = true;
//   }
//   return [isOptional, chars];
// }

// function expandAbbrev(abbrev: string): string[] {
//   if (!/[\\[\(?\|\\]/.test(abbrev)) {
//       return [abbrev];
//   }

//   abbrev = abbrev.replace(/(?<!\\)\./g, '\\.');
//   let chars = abbrev.split('');
//   let outs = [''];
  
//   while (chars.length > 0) {
//       let char = chars.shift()!;
//       let isOptional = false;
//       const nexts: string[] = [];

//       if (char === '[') {
//           while (chars.length > 0) {
//               const next = chars.shift()!;
//               if (next === ']') {
//                   break;
//               } else if (next === '\\') {
//                   continue;
//               } else {
//                   let accents = handleAccent(next);
//                   accents = accents.replace(/^\[|\]$/g, '');
//                   for (let i=0;i<accents.length;i++) {
//                       nexts.push(accents[i]);
//                   }
//               }
//           }
//           [isOptional, chars] = isNextCharOptional(chars);
//           if (isOptional) nexts.push('');
//           const temps: string[] = [];
//           const alreadys: Set<string> = new Set();
//           for (const out of outs) {
//               for (const next of nexts) {
//                   if (!alreadys.has(next)) {
//                       temps.push(out + next);
//                       alreadys.add(next);
//                   }
//               }
//           }
//           outs = temps;
//       } else if (char === '(') {
//           const nexts: string[] = [];
//           while (chars.length > 0) {
//               const next = chars.shift()!;
//               if (next === '?' && chars[0] === ':') {
//                   throw new Error("'(?:' in parentheses; replace with just '('");
//               }
//               if (next === ')') {
//                   break;
//               } else if (next === '\\') {
//                   nexts.push(next);
//                   nexts.push(chars.shift()!);
//               } else {
//                   nexts.push(next);
//               }
//           }
//           const expandedNexts = expandAbbrev(nexts.join(''));
//           [isOptional, chars] = isNextCharOptional(chars);
//           if (isOptional) expandedNexts.push('');
//           const temps: string[] = [];
//           for (const out of outs) {
//               for (const next of expandedNexts) {
//                   temps.push(out + next);
//               }
//           }
//           outs = temps;
//       } else if (char === '|') {
//           return [...outs, ...expandAbbrev(chars.join(''))];
//       } else {
//           const temps: string[] = [];
//           if (char === '\\') {
//               char = chars.shift()!;
//           }
//           [isOptional, chars] = isNextCharOptional(chars);
//           for (const out of outs) {
//               temps.push(out + char);
//               if (isOptional) {
//                   temps.push(out);
//               }
//           }
//           outs = temps;
//       }
//   }

//   if (outs.join('').match(/[\[\]]/)) {
//       console.error("Unexpected char:", outs);
//       throw new Error("Unexpected char");
//   }
  
//   return outs;
// }

// function getOrder() {
//   let out = [];
//   const file = fs.readFileSync(`${dir}/${lang}/data.txt`, 'utf-8');
//   for (const line of file.split('\n')) {
//     if (!line.startsWith('=')) {
//       continue;
//     }
//     const osis = line.replace(/^=/, '').normalize('NFC').normalize('NFD');
//     isValidOsis(osis);
//     const apocrypha = validOsises[osis] === 'apocrypha' ? true : false;
//     out.push({ osis, apocrypha });
//     abbrevs[osis] = abbrevs[osis] || {};
//     abbrevs[osis][osis] = true;
//     rawAbbrevs[osis] = rawAbbrevs[osis] || {};
//     rawAbbrevs[osis][osis] = true;
//   }
//   return out;
// }

// function isValidOsis(osis: string): void {
//   for (const part of osis.split(',')) {
//     if (!(part in validOsises)) {
//       throw new Error(`Invalid OSIS: ${osis} (${part})`);
//     }
//   }
// }

// function makeTests() {
//   const out: string[] = [];
//   const osises: Array<{ osis: string, apocrypha: boolean }> = [...order];
//   const allAbbrevs: any = {};

//   for (const osis of Object.keys(abbrevs).sort()) {
//     if (!osis.includes(',')) continue;
//     osises.push({ osis, apocrypha: false });
//   }

//   for (const ref of osises) {
//     const osis = ref.osis;
//     const tests: string[] = [];
//     const first = osis.split(',')[0];
//     const match = `${first}.1.1`;

//     for (const abbrev of sortAbbrevsByLength(Object.keys(abbrevs[osis]))) {
//       for (const expanded of expandAbbrevVars(abbrev)) {
//         addAbbrevToAllAbbrevs(osis, expanded, allAbbrevs);
//         tests.push(`\t\texpect(p.parse("${expanded} 1:1").osis()).toEqual("${match}", "parsing: '${expanded} 1:1'")`);
//       }

//       for (const altOsis of osises.map(o => o.osis)) {
//         if (osis === altOsis) continue;
//         for (const altAbbrev of Object.keys(abbrevs[altOsis])) {
//           if (altAbbrev.length < abbrev.length) continue;
//           const qAbbrev = new RegExp(`\\b${abbrev}\\b`, 'i');
//           if (qAbbrev.test(altAbbrev)) {
//             for (const check of osises.map(o => o.osis)) {
//               if (altOsis === check) break;
//               if (osis !== check) continue;
//               console.log(`${altOsis} should be before ${osis} in parsing order\n ${altAbbrev} matches ${abbrev}`);
//             }
//           }
//         }
//       }
//     }

//     out.push(`describe "Localized book ${osis} (${lang})", ->`);
//     out.push(`\tp = {}`);
//     out.push(`\tbeforeEach ->`);
//     out.push(`\t\tp = new bcv_parser`);
//     out.push(`\t\tp.set_options({ book_alone_strategy: "ignore", book_sequence_strategy: "ignore", osis_compaction_strategy: "bc", captive_end_digits_strategy: "delete" })`);
//     out.push(`\t\tp.include_apocrypha(true)`);
//     out.push(`\tit "should handle book: ${osis} (${lang})", ->`);
//     out.push(`\t\t\``);
//     out.push(...tests);
//     out.push(addNonLatinDigitTests(osis, tests));

//     if (validOsises[first] !== 'apocrypha') {
//       out.push(` p.include_apocrypha(false)`);
//       for (const abbrev of sortAbbrevsByLength(Object.keys(abbrevs[osis]))) {
//         for (let expanded of expandAbbrevVars(abbrev)) {
//           expanded = ucNormalize(expanded);
//           out.push(`\t\texpect(p.parse("${expanded} 1:1").osis()).toEqual("${match}", "parsing: '${expanded} 1:1'")`);
//         }
//       }
//     }
//     out.push(`\t\t\``);
//     out.push(`\t\ttrue`);
//   }

//   const outStream = `${dir}/${lang}/book_names.txt`;
//   for (const osis of Object.keys(allAbbrevs).sort()) {
//     const osisAbbrevs = sortAbbrevsByLength(allAbbrevs[osis]);
//     const useOsis = osis.replace(/,+$/, '');
//     for (let abbrev of osisAbbrevs) {
//       abbrev = abbrev.replace(/\u2009/g, ' ');
//       console.log(`${useOsis}\t${abbrev}`);
//     }
//     allAbbrevs[osis] = osisAbbrevs;
//   }

//   const miscTests = [];
//   miscTests.push(addRangeTests());
//   miscTests.push(addChapterTests());
//   miscTests.push(addVerseTests());
//   miscTests.push(addSequenceTests());
//   miscTests.push(addTitleTests());
//   miscTests.push(addFfTests());
//   miscTests.push(addNextTests());
//   miscTests.push(addTransTests());
//   miscTests.push(addBookRangeTests());
//   miscTests.push(addBoundaryTests());

//   let outTemplate = getFileContents(`${dir}/template/spec.coffee`);
//   const langIsos = JSON.stringify(vars['$LANG_ISOS']);
//   outTemplate = outTemplate.replace(/\$LANG_ISOS/g, langIsos);
//   outTemplate = outTemplate.replace(/\$LANG/g, lang);
//   outTemplate = outTemplate.replace(/\$BOOK_TESTS/g, out.join("\n"));
//   outTemplate = outTemplate.replace(/\$MISC_TESTS/g, miscTests.join("\n"));

//   const specCoffeePath = `${dir}/${lang}/spec.coffee`;
//   console.log(outTemplate, specCoffeePath);

//   if (/\$[A-Z]+/.test(outTemplate)) {
//     throw new Error('Tests: Capital variable');
//   }

//   const specRunnerPath = `${testDir}/${lang}.html`;
//   let specRunner = getFileContents(`${dir}/template/SpecRunner.html`);
//   specRunner = specRunner.replace(/\$LANG/g, lang);
//   console.log(specRunner, specRunnerPath);

//   if (/\$[A-Z]/.test(specRunner)) {
//     throw new Error('Tests: Capital variable');
//   }

//   return allAbbrevs;
// }

// function sortAbbrevsByLength(abbrevs: any) {
//   const lengths: { [length: number]: string[] } = {};

//   for (const abbrev of abbrevs) {
//       const length = abbrev.length;
//       if (!lengths[length]) {
//           lengths[length] = [];
//       }
//       lengths[length].push(abbrev);
//   }

//   const sortedAbbrevs: string[] = [];
//   const sortedLengths = Object.keys(lengths).map(Number).sort((a, b) => b - a);

//   for (const length of sortedLengths) {
//       sortedAbbrevs.push(...lengths[length].sort());
//   }

//   return sortedAbbrevs;
// }

// function expandAbbrevVars(abbrev: string): string[] {
//   abbrev = abbrev.replace(/\\(?![\(\)\[\]\|s])/g, '');
  
//   if (!/\$[A-Z]+/.test(abbrev)) {
//       return [abbrev];
//   }

//   const varMatch = abbrev.match(/(\$[A-Z]+)(?!\w)/);
//   const variable = varMatch ? varMatch[0] : '';
//   const expandedAbbrevs: string[] = [];
//   let recurse = false;

//   if (variable && vars[variable]) {
//       for (const value of vars[variable]) {
//           for (let val of expandAbbrev(value)) {
//               val = handleAccents(val);
//               let temp = abbrev.replace(new RegExp(`\\${variable}(?!\\w)`), val);
//               if (/\$/.test(temp)) {
//                   recurse = true;
//               }
//               expandedAbbrevs.push(temp);

//               if (/^\$(?:FIRST|SECOND|THIRD|FOURTH|FIFTH)$/.test(variable) && (/^\d|^[IV]+$/.test(val))) {
//                   const safeVar = variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//                   const temp2 = abbrev.replace(new RegExp(safeVar + '([^.]|$)'), val + '.$1');
//                   expandedAbbrevs.push(temp2);
//               }
//           }
//       }
//   }

//   if (recurse) {
//       const recursiveResults: string[] = [];
//       for (const abbrev of expandedAbbrevs) {
//           recursiveResults.push(...expandAbbrevVars(abbrev));
//       }
//       return recursiveResults;
//   }

//   return expandedAbbrevs;
// }

// function addAbbrevToAllAbbrevs(osis: string, abbrev: string, allAbbrevs: any): void {
//   if (abbrev.includes('.') && abbrev !== "\u0418.\u041d") {
//       const news = abbrev.split('.');
//       let olds = [news.shift() as string];

//       for (const newAbbrev of news) {
//           const temp: string[] = [];
//           for (const old of olds) {
//               temp.push(`${old}.${newAbbrev}`);
//               temp.push(`${old}${newAbbrev}`);
//           }
//           olds = temp;
//       }

//       for (const abbr of olds) {
//           allAbbrevs[osis][abbr] = true;
//       }
//   } else {
//       allAbbrevs[osis][abbrev] = true;
//   }
// }

// function addNonLatinDigitTests(osis: string, args: string[]) {
//   const out: any = [];
//   const temp = args.join("\n");

//   const regex = /[\u0660-\u0669\u06f0-\u06f9\u07c0-\u07c9\u0966-\u096f\u09e6-\u09ef\u0a66-\u0a6f\u0ae6-\u0aef\u0b66-\u0b6f\u0be6-\u0bef\u0c66-\u0c6f\u0ce6-\u0cef\u0d66-\u0d6f\u0e50-\u0e59\u0ed0-\u0ed9\u0f20-\u0f29\u1040-\u1049\u1090-\u1099\u17e0-\u17e9\u1810-\u1819\u1946-\u194f\u19d0-\u19d9\u1a80-\u1a89\u1a90-\u1a99\u1b50-\u1b59\u1bb0-\u1bb9\u1c40-\u1c49\u1c50-\u1c59\uA620-\uA629\uA8d0-\uA8d9\uA900-\uA909\uA9d0-\uA9d9\uAA50-\uAA59\uABF0-\uABF9\uff10-\uff19]/;

//   if (!regex.test(temp)) {
//       return out;
//   }

//   out.push("\t\t`");
//   out.push("\t\ttrue");
//   out.push(`\tit "should handle non-Latin digits in book: ${osis} ($lang)", ->`);
//   out.push("\t\tp.set_options non_latin_digits_strategy: \"replace\"");
//   out.push("\t\t`");
  
//   return [...out, ...args];
// }

// function addRangeTests() {
//   const out = [];
//   out.push(`\tit "should handle ranges ($lang)", ->`);

//   for (const abbrev of vars["$TO"]) {
//       for (const to of expandAbbrev(removeExclamations(handleAccents(abbrev)))) {
//           out.push(`\t\texpect(p.parse("Titus 1:1 ${to} 2").osis()).toEqual("Titus.1.1-Titus.1.2", "parsing: 'Titus 1:1 ${to} 2'")`);
//           out.push(`\t\texpect(p.parse("Matt 1${to}2").osis()).toEqual("Matt.1-Matt.2", "parsing: 'Matt 1${to}2'")`);
//           out.push(`\t\texpect(p.parse("Phlm 2 ${ucNormalize(to)} 3").osis()).toEqual("Phlm.1.2-Phlm.1.3", "parsing: 'Phlm 2 ${ucNormalize(to)} 3'")`);
//       }
//   }
  
//   return out;
// }

// function addChapterTests() {
//   const out = [];
//   out.push(`\tit "should handle chapters ($lang)", ->`);

//   for (const abbrev of vars["$CHAPTER"]) {
//       for (const chapter of expandAbbrev(removeExclamations(handleAccents(abbrev)))) {
//           out.push(`\t\texpect(p.parse("Titus 1:1, ${chapter} 2").osis()).toEqual("Titus.1.1,Titus.2", "parsing: 'Titus 1:1, ${chapter} 2'")`);
//           out.push(`\t\texpect(p.parse("Matt 3:4 ${ucNormalize(chapter)} 6").osis()).toEqual("Matt.3.4,Matt.6", "parsing: 'Matt 3:4 ${ucNormalize(chapter)} 6'")`);
//       }
//   }
  
//   return out;
// }

// function addVerseTests() {
//   const out = [];
//   out.push(`\tit "should handle verses ($lang)", ->`);

//   for (const abbrev of vars["$VERSE"]) {
//       for (const verse of expandAbbrev(removeExclamations(handleAccents(abbrev)))) {
//           out.push(`\t\texpect(p.parse("Exod 1:1 ${verse} 3").osis()).toEqual("Exod.1.1,Exod.1.3", "parsing: 'Exod 1:1 ${verse} 3'")`);
//           out.push(`\t\texpect(p.parse("Phlm ${ucNormalize(verse)} 6").osis()).toEqual("Phlm.1.6", "parsing: 'Phlm ${ucNormalize(verse)} 6'")`);
//       }
//   }

//   return out;
// }

// function addSequenceTests() {
//   const out = [];
//   out.push(`\tit "should handle 'and' ($lang)", ->`);

//   for (const abbrev of vars["$AND"]) {
//       for (const and of expandAbbrev(removeExclamations(handleAccents(abbrev)))) {
//           out.push(`\t\texpect(p.parse("Exod 1:1 ${and} 3").osis()).toEqual("Exod.1.1,Exod.1.3", "parsing: 'Exod 1:1 ${and} 3'")`);
//           out.push(`\t\texpect(p.parse("Phlm 2 ${ucNormalize(and)} 6").osis()).toEqual("Phlm.1.2,Phlm.1.6", "parsing: 'Phlm 2 ${ucNormalize(and)} 6'")`);
//       }
//   }

//   return out;
// }

// function addTitleTests() {
//   const out = [];
//   out.push(`\tit "should handle titles ($lang)", ->`);

//   for (const abbrev of vars["$TITLE"]) {
//       for (const title of expandAbbrev(removeExclamations(handleAccents(abbrev)))) {
//           out.push(`\t\texpect(p.parse("Ps 3 ${title}, 4:2, 5:${title}").osis()).toEqual("Ps.3.1,Ps.4.2,Ps.5.1", "parsing: 'Ps 3 ${title}, 4:2, 5:${title}'")`);
//           out.push(`\t\texpect(p.parse("${ucNormalize(`Ps 3 ${title}, 4:2, 5:${title}`)}").osis()).toEqual("Ps.3.1,Ps.4.2,Ps.5.1", "parsing: '${ucNormalize(`Ps 3 ${title}, 4:2, 5:${title}`)}'")`);
//       }
//   }

//   return out;
// }

// function addFfTests() {
//   const out = [];
//   out.push(`\tit "should handle 'ff' ($lang)", ->`);
//   if (lang === 'it') out.push("\t\tp.set_options {case_sensitive: \"books\"}");

//   for (const abbrev of vars["$FF"]) {
//       for (const ff of expandAbbrev(removeExclamations(handleAccents(abbrev)))) {
//           out.push(`\t\texpect(p.parse("Rev 3${ff}, 4:2${ff}").osis()).toEqual("Rev.3-Rev.22,Rev.4.2-Rev.4.11", "parsing: 'Rev 3${ff}, 4:2${ff}'")`);
//           if (lang !== 'it') {
//               out.push(`\t\texpect(p.parse("${ucNormalize(`Rev 3 ${ff}, 4:2 ${ff}`)}").osis()).toEqual("Rev.3-Rev.22,Rev.4.2-Rev.4.11", "parsing: '${ucNormalize(`Rev 3 ${ff}, 4:2 ${ff}`)}'")`);
//           }
//       }
//   }

//   return out;
// }

// function addNextTests() {
//   if (!vars['$NEXT']) {
//       return [];
//   }

//   const out = [];
//   out.push(`\tit "should handle 'next' ($lang)", () => {`);
//   if (lang === 'it') out.push(`\t\tp.set_options({ case_sensitive: "books" });`);

//   for (const abbrev of vars['$NEXT']) {
//       for (const next of expandAbbrev(removeExclamations(handleAccents(abbrev)))) {
//           out.push(`\t\texpect(p.parse("Rev 3:1${next}, 4:2${next}").osis()).toEqual("Rev.3.1-Rev.3.2,Rev.4.2-Rev.4.3", "parsing: 'Rev 3:1${next}, 4:2${next}'");`);
//           if (lang !== 'it') {
//               out.push(`\t\texpect(p.parse("${ucNormalize(`Rev 3 ${next}, 4:2 ${next}`)}").osis()).toEqual("Rev.3-Rev.4,Rev.4.2-Rev.4.3", "parsing: '${ucNormalize(`Rev 3 ${next}, 4:2 ${next}`)}'");`);
//           }
//           out.push(`\t\texpect(p.parse("Jude 1${next}, 2${next}").osis()).toEqual("Jude.1.1-Jude.1.2,Jude.1.2-Jude.1.3", "parsing: 'Jude 1${next}, 2${next}'");`);
//           out.push(`\t\texpect(p.parse("Gen 1:31${next}").osis()).toEqual("Gen.1.31-Gen.2.1", "parsing: 'Gen 1:31${next}'");`);
//           out.push(`\t\texpect(p.parse("Gen 1:2-31${next}").osis()).toEqual("Gen.1.2-Gen.2.1", "parsing: 'Gen 1:2-31${next}'");`);
//           out.push(`\t\texpect(p.parse("Gen 1:2${next}-30").osis()).toEqual("Gen.1.2-Gen.1.3,Gen.1.30", "parsing: 'Gen 1:2${next}-30'");`);
//           out.push(`\t\texpect(p.parse("Gen 50${next}, Gen 50:26${next}").osis()).toEqual("Gen.50,Gen.50.26", "parsing: 'Gen 50${next}, Gen 50:26${next}'");`);
//           out.push(`\t\texpect(p.parse("Gen 1:32${next}, Gen 51${next}").osis()).toEqual("", "parsing: 'Gen 1:32${next}, Gen 51${next}'");`);
//       }
//   }

//   if (lang === 'it') out.push(`\t\tp.set_options({ case_sensitive: "none" });`);
//   return out;
// }

// function addTransTests() {
//   const out = [];
//   out.push(`\tit "should handle translations ($lang)", () => {`);

//   for (const abbrev of vars['$TRANS'].sort()) {
//       for (const translation of expandAbbrev(removeExclamations(handleAccents(abbrev)))) {
//           const [trans, osis] = translation.split(',') || [translation, translation];
//           out.push(`\t\texpect(p.parse("Lev 1 (${trans})").osis_and_translations()).toEqual([["Lev.1", "${osis}"]]);`);
//           out.push(`\t\texpect(p.parse("${(`Lev 1 ${trans}`).toLowerCase()}").osis_and_translations()).toEqual([["Lev.1", "${osis}"]]);`);
//       }
//   }

//   return out;
// }

// function addBookRangeTests() {
//   const first = expandAbbrev(handleAccents(vars['$FIRST'][0]))[0];
//   const third = expandAbbrev(handleAccents(vars['$THIRD'][0]))[0];
//   let john = '';

//   for (const key of Object.keys(rawAbbrevs['1John']).sort()) {
//       if (/^\$FIRST/.test(key)) {
//           john = key.replace(/^\$FIRST(?!\w)/, '');
//           break;
//       }
//   }

//   if (!john) {
//       console.warn("  Warning: no available John abbreviation for testing book ranges");
//       return [];
//   }

//   const out = [];
//   const johns = expandAbbrev(handleAccents(john));
//   out.push(`\tit "should handle book ranges ($lang)", () => {`);
//   out.push(`\t\tp.set_options({ book_alone_strategy: "full", book_range_strategy: "include" });`);

//   const alreadys: Record<string, number> = {};

//   for (const abbrev of johns) {
//       for (const to_regex of vars['$TO']) {
//           for (const to of expandAbbrev(removeExclamations(handleAccents(to_regex)))) {
//               if (!alreadys[`${first} ${to} ${third} ${abbrev}`]) {
//                   out.push(`\t\texpect(p.parse("${first} ${to} ${third} ${abbrev}").osis()).toEqual("1John.1-3John.1", "parsing: '${first} ${to} ${third} ${abbrev}'");`);
//                   alreadys[`${first} ${to} ${third} ${abbrev}`] = 1;
//               }
//           }
//       }
//   }

//   return out;
// }

// function addBoundaryTests() {
//   const out = [];
//   out.push(`\tit "should handle boundaries ($lang)", () => {`);
//   out.push(`\t\tp.set_options({ book_alone_strategy: "full" });`);
//   out.push(`\t\texpect(p.parse("\\u2014Matt\\u2014").osis()).toEqual("Matt.1-Matt.28", "parsing: '\\u2014Matt\\u2014'");`);
//   out.push(`\t\texpect(p.parse("\\u201cMatt 1:1\\u201d").osis()).toEqual("Matt.1.1", "parsing: '\\u201cMatt 1:1\\u201d'");`);
//   return out;
// }

// function removeExclamations(text: string): string {
//   if (text.includes('!')) {
//       text = text.split('!')[0];
//   }
//   return text;
// }
