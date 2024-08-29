"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const childProcess = require("child_process");
const lang = process.argv[2];
if (!lang) {
    console.error('Please specify a language identifier as the first argument');
    process.exit(1);
}
const tempGrammarFile = `../temp_${lang}_grammar.js`;
const grammarFile = `../src/${lang}/grammar.pegjs`;
// Run PEG.js to generate grammar file
childProcess.execSync(`pegjs --format globals --export-var grammar -o ${tempGrammarFile} ${grammarFile}`);
// Add PEG.js global variables
addPegjsGlobal(tempGrammarFile);
console.log('Joining...');
// Concatenate and compile CoffeeScript files
const coffeeFiles = [
    '../src/core/bcv_parser.coffee',
    '../src/core/bcv_passage.coffee',
    '../src/core/bcv_utils.coffee',
    `../src/${lang}/translations.coffee`,
    `../src/${lang}/regexps.coffee`,
];
const outputJsFile = `../js/${lang}_bcv_parser.js`;
const coffeeCmd = `cat ${coffeeFiles.join(' ')} | coffee --no-header --compile --stdio > ${outputJsFile}`;
childProcess.execSync(coffeeCmd);
// Add PEG.js code to output JS file
addPeg(outputJsFile, '');
console.log('Compiling spec...');
// Compile spec CoffeeScript file
const specFile = `../src/${lang}/spec.coffee`;
const specJsFile = `../test/js/${lang}.spec.js`;
childProcess.execSync(`coffee --no-header -c ${specFile}`);
childProcess.execSync(`mv ${specFile.replace('.coffee', '.js')} ${specJsFile}`);
// Remove temporary grammar file
fs.unlinkSync(tempGrammarFile);
function addPegjsGlobal(file) {
    const content = fs.readFileSync(file, 'utf8');
    const modifiedContent = `var grammar;\n${content}`;
    modifiedContent.replace(/\broot\.grammar/g, 'grammar');
    fs.writeFileSync(file, modifiedContent);
}
function addPeg(outputFile, prefix) {
    const pegContent = fs.readFileSync(tempGrammarFile, 'utf8');
    const outputFileContent = fs.readFileSync(outputFile, 'utf8');
    const modifiedContent = outputFileContent.replace(/(\s*\}\)\.call\(this\);\s*)$/, `\n${pegContent}\n$1`);
    if (modifiedContent === outputFileContent) {
        throw new Error('PEG not successfully added');
    }
    fs.writeFileSync(outputFile, modifiedContent);
}
//# sourceMappingURL=02.compile.js.map