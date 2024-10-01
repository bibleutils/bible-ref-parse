import * as fs from 'fs';
import * as childProcess from 'child_process';
import * as path from 'path';
import { platform } from 'process';


let scriptPath: string;
const lang = process.argv[2];


if (!lang) {
	console.error('Please specify a language identifier as the first argument');
	process.exit(1);
}

const isWindows = platform === 'win32';
const isMac = platform === 'darwin';
const isLinux = platform === 'linux';

let tempGrammarFile: string;
let grammarFile: string;
let coffeeFiles: string[];
let outputJsFile: string;
let specFile: string;
let specJsFile: string;
let specTestJsFile: string;

if (isWindows) {
	scriptPath = path.win32.resolve(__dirname, '..');
	
	// Grammer files
	tempGrammarFile = path.win32.join(scriptPath, `temp_${lang}_grammar.js`);
	grammarFile = path.win32.join(scriptPath, 'src', lang, 'grammar.pegjs');
	
	// CoffeeScript files
	coffeeFiles = [
		path.win32.join(`${scriptPath}/src/core/bcv_parser.coffee`),
		path.win32.join(`${scriptPath}/src/core/bcv_passage.coffee`),
		path.win32.join(`${scriptPath}/src/core/bcv_utils.coffee`),
		path.win32.join(`${scriptPath}/src/${lang}/translations.coffee`),
		path.win32.join(`${scriptPath}/src/${lang}/regexps.coffee`),
	];
	outputJsFile = path.win32.join(`${scriptPath}/js/${lang}_bcv_parser.js`);
	
	// spec files
	specFile = path.win32.join(`${scriptPath}/src/${lang}/spec.coffee`);
	specJsFile = path.win32.join(`${scriptPath}/src/${lang}/spec.js`);
	specTestJsFile = path.win32.join(`${scriptPath}/test/js/${lang}.spec.js`);
} else if (isMac || isLinux) {
	scriptPath = path.posix.resolve(__dirname, '..');
	
	// Grammer files
	tempGrammarFile = path.posix.resolve(scriptPath, `temp_${lang}_grammar.js`);
	grammarFile = path.posix.resolve(scriptPath, 'src', lang, 'grammar.pegjs');

	// CoffeeScript files
	coffeeFiles = [
		`${scriptPath}/src/core/bcv_parser.coffee`,
		`${scriptPath}/src/core/bcv_passage.coffee`,
		`${scriptPath}/src/core/bcv_utils.coffee`,
		`${scriptPath}/src/${lang}/translations.coffee`,
		`${scriptPath}/src/${lang}/regexps.coffee`,
	];
	outputJsFile = `${scriptPath}/js/${lang}_bcv_parser.js`;

	// spec files
	specFile = `${scriptPath}/src/${lang}/spec.coffee`;
	specJsFile = `${scriptPath}/src/${lang}/spec.js`;
	specTestJsFile = `${scriptPath}/test/js/${lang}.spec.js`;
} else {
	console.error('Unknown OS');
	process.exit(1);
}

// console.debug(`Temp Grammer File: ${tempGrammarFile}`);
// console.debug(`Grammer File: ${grammarFile}`);
// console.debug(`Spec File: ${specFile}`);
// console.debug(`Spec JS File: ${specJsFile}`);
// console.debug(`Spec Test JS File: ${specTestJsFile}`);


let cmd: string = `bash -c pegjs --format globals --export-var grammar -o ${tempGrammarFile} ${grammarFile}`;
try {
	// Run PEG.js to generate grammar file
	if (isWindows) {
		cmd = `powershell -Command "npx pegjs --format globals --export-var grammar -o ${tempGrammarFile} ${grammarFile}"`
	}
	// console.debug(cmd);
	childProcess.execSync(cmd);

	// Add PEG.js global variables
	addPegjsGlobal(tempGrammarFile);

	console.log('Joining...');
	if (isWindows) {
		const commaSeparatedPaths = coffeeFiles.map(file => "'" + file.replace("'", "''") + "'").join(', ');
		cmd = `powershell -Command "Get-Content -Path @(${commaSeparatedPaths}) | npx coffee --no-header --compile --stdio | Out-File -FilePath '${outputJsFile}' -Encoding UTF8"`;
	} else {
		cmd = `bash -c cat ${coffeeFiles.join(' ')} | coffee --no-header --compile --stdio > ${outputJsFile}`;
	}

	// console.debug(cmd);
	childProcess.execSync(cmd, { encoding: 'utf-8' });
	// console.log(output);

	// Add PEG.js code to output JS file
	addPeg('');
	console.log('Compiling spec...');

	// Compile spec CoffeeScript file
	cmd = `npx coffee --no-header -c ${specFile}`;
	// console.debug(cmd);
	childProcess.execSync(cmd, { encoding: 'utf-8' });
	// console.log(output);

	if (isWindows) {
		cmd = `powershell -Command "Move-Item -Path ${specJsFile} -Destination ${specTestJsFile}"`;
		// cmd = `powershell -Command "Rename-Item -Path ${specFile} -NewName ${specJsFile}"`;
	}
	else
		cmd = `bash -c mv ${specJsFile} ${specTestJsFile}`;

	childProcess.execSync(cmd, { encoding: 'utf-8' });
	// console.log(output);

	// Remove temporary grammar file
	fs.unlinkSync(tempGrammarFile);
} catch (error: any) {
	console.error(`Unexpected Error While Executing: ${error?.message}`);
	process.exit(error?.status);
}

function addPegjsGlobal(file: string) {
	const content = fs.readFileSync(file, {encoding: 'utf-8'});
	let modifiedContent = `var grammar;\n${content}`;
	modifiedContent = modifiedContent.replace(/\broot\.grammar/g, 'grammar');
	fs.writeFileSync(file, modifiedContent, { encoding: 'utf-8'});
}

function addPeg(prefix: string): void {
	// Read the content of the temp grammar file
	const pegFilePath = `${scriptPath}/temp_${prefix}${lang}_grammar.js`;
	let peg;
	if (fs.existsSync(pegFilePath))
		peg = fs.readFileSync(pegFilePath, {encoding: 'utf-8'});
	else
		throw Error(`${pegFilePath} does not exist`);

	// New parse functions
	const newParseSpace = `
function peg$parsespace() {
    var res;
    if (res = /^[\\s\\xa0*]+/.exec(input.substr(peg$currPos))) {
        peg$currPos += res[0].length;
        return [];
    }
    return peg$FAILED;
}`;
	const newParseInteger = `
function peg$parseinteger() {
    var res;
    if (res = /^[0-9]{1,3}(?!\\d|,000)/.exec(input.substr(peg$currPos))) {
        peg$savedPos = peg$currPos;
        peg$currPos += res[0].length;
        return {"type": "integer", "value": parseInt(res[0], 10), "indices": [peg$savedPos, peg$currPos - 1]};
    } else {
        return peg$FAILED;
    }
}`;
	const newParseAnyInteger = `
function peg$parseany_integer() {
    var res;
    if (res = /^[0-9]+/.exec(input.substr(peg$currPos))) {
        peg$savedPos = peg$currPos;
        peg$currPos += res[0].length;
        return {"type": "integer", "value": parseInt(res[0], 10), "indices": [peg$savedPos, peg$currPos - 1]};
    } else {
        return peg$FAILED;
    }
}`;

	const newOptionsCheck = getNewOptionsCheck(peg);

	// Replace existing parse functions and add the options check
	peg = peg.replace(/function peg\$parsespace\(\) \{[\s\S]*?return s0;\s*\}/, newParseSpace);
	peg = peg.replace(/function peg\$parseinteger\(\) \{[\s\S]*?return s0;\s*\}/, newParseInteger);
	// peg = peg.replace(/function peg\$parseany_integer\(\) \{(?:(?:.|\n)(?!return s0))*?.return s0;\s*\}/, newParseInteger);
	peg = peg.replace(/(function text\(\) \{)/, `${newOptionsCheck}\n\n    $1`);
	peg = peg.replace(/ \\t\\r\\n\\xa0/gi, "\\s\\xa0");
	peg = peg.replace(/ \\\\t\\\\r\\\\n\\\\xa0/gi, "\\\\s\\\\xa0");

	// Error checking
	if (!peg.includes('"punctuation_strategy"')) {
		throw new Error("Unreplaced options");
	}

	// Merge the modified PEG content into the destination file
	mergeFile(`${scriptPath}/js/#PREFIX${lang}_bcv_parser.js`, peg, prefix);
}

function extractSequenceRegexVar(peg: string): string {
	const sequenceVarMatch = peg.match(/function peg\$parsesequence_sep\(\) \{\s+var s.+;\s+s0 =.+\s+s1 =.+\s+if \((peg\$c\d+)\.test/);
	if (!sequenceVarMatch) {
		throw new Error("No sequence var");
	}
	return sequenceVarMatch[1];
}

function getSequenceRegexValue(peg: string, sequenceRegexVar: string): string {
	const escapedRegex = sequenceRegexVar.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); // quotemeta equivalent
	const regex = RegExp(`${escapedRegex} = \\/\\^\\[,([^\\]]+?\\]\\/)`);
	const sequenceValueMatch = peg.match(regex);
	if (!sequenceValueMatch) {
		throw new Error("No sequence value");
	}
	return `/^[${sequenceValueMatch[1]}`;
}

function getNewOptionsCheck(peg: string): string {
	const sequenceRegexVar = extractSequenceRegexVar(peg);
	const sequenceRegexValue = getSequenceRegexValue(peg, sequenceRegexVar);

	const newOptionsCheck = `if ("punctuation_strategy" in options && options.punctuation_strategy === "eu") {
    peg$parsecv_sep = peg$parseeu_cv_sep;
    ${sequenceRegexVar} = ${sequenceRegexValue};
}`;
	return newOptionsCheck;
}

function mergeFile(file: string, peg: string, prefix: string): void {
	if (prefix) {
		prefix += "/";
	}

	// Remove "#PREFIX" from the file name
	let srcFile = file.replace('#PREFIX', '');

	// Read the content of the source file
	let joined = fs.readFileSync(srcFile, {encoding: 'utf-8'});
	const prev = joined;

	// Replace the pattern with the peg content
	// console.log(joined.match(/(\s*\}\)\.call\(this\);\s*)$/));
	joined = joined.replace(/(\s*\}\)\.call\(this\);\s*)$/, `\n${peg}$1`);

	// If no changes were made, throw an error
	if (prev === joined) {
		throw new Error("PEG not successfully added");
	}

	// Modify the destination file path by replacing "#PREFIX" with the prefix
	let destFile = file.replace('#PREFIX', prefix);

	// Write the updated content to the destination file
	fs.writeFileSync(destFile, joined, {encoding: 'utf-8'});
}
