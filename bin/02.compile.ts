import * as fs from 'fs';
import * as childProcess from 'child_process';
import * as path from 'path';
import { CONFIG } from './config';


let scriptPath: string;
const lang = CONFIG.language;


let coffeeFiles: string[];

scriptPath = path.posix.resolve(__dirname, '..');

// CoffeeScript files
coffeeFiles = [
	CONFIG.paths.core.parser,
	CONFIG.paths.core.passage,
	CONFIG.paths.core.utils,
	CONFIG.paths.build.translations,
	CONFIG.paths.build.regexps,
];

// spec files

let cmd: string = `npx pegjs --format globals --export-var grammar -o ${CONFIG.paths.temp.grammar} ${CONFIG.paths.build.grammar}`;
try {
	// Run PEG.js to generate grammar file
	if (CONFIG.isWindows) {
		cmd = `powershell -Command "npx pegjs --format globals --export-var grammar -o ${CONFIG.paths.temp.grammar} ${CONFIG.paths.build.grammar}"`
	}
	// console.debug(cmd);
	childProcess.execSync(cmd);

	// Add PEG.js global variables
	addPegjsGlobal(CONFIG.paths.temp.grammar);

	console.log('Joining...');
	if (CONFIG.isWindows) {
		const commaSeparatedPaths = coffeeFiles.map(file => "'" + file.replace("'", "''") + "'").join(', ');
		cmd = `powershell -Command "Get-Content -Path @(${commaSeparatedPaths}) | npx coffee --no-header --compile --stdio | Out-File -FilePath '${CONFIG.paths.dist.js}' -Encoding UTF8"`;
	} else {
		cmd = `cat ${coffeeFiles.join(' ')} | coffee --no-header --compile --stdio > ${CONFIG.paths.dist.js}`;
	}

	// console.debug(cmd);
	childProcess.execSync(cmd, { encoding: 'utf-8' });
	// console.log(output);

	// Add PEG.js code to output JS file
	addPeg();
	console.log('Compiling spec...');

	// Compile spec CoffeeScript file
	cmd = `npx coffee --no-header -c ${CONFIG.paths.build.spec}`;
	// console.debug(cmd);
	childProcess.execSync(cmd, { encoding: 'utf-8' });
	// console.log(output);

	if (CONFIG.isWindows) {
		cmd = `powershell -Command "Move-Item -Path ${CONFIG.paths.dist.specJs} -Destination ${CONFIG.paths.dist.specTestJs}"`;
	}
	else
		cmd = `mv ${CONFIG.paths.dist.specJs} ${CONFIG.paths.dist.specTestJs}`;

	childProcess.execSync(cmd, { encoding: 'utf-8' });
	// console.log(output);

	// Remove temporary grammar file
	fs.unlinkSync(CONFIG.paths.temp.grammar);
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

function addPeg(): void {
	// Read the content of the temp grammar file
	let peg;
	if (fs.existsSync(CONFIG.paths.temp.grammar))
		peg = fs.readFileSync(CONFIG.paths.temp.grammar, {encoding: 'utf-8'});
	else
		throw Error(`${CONFIG.paths.temp.grammar} does not exist`);

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
	mergeFile(`${scriptPath}/js/#PREFIX${lang}_bcv_parser.js`, peg);
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

function mergeFile(file: string, peg: string): void {
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

	// Write the updated content to the destination file
	fs.writeFileSync(srcFile, joined, {encoding: 'utf-8'});
}
