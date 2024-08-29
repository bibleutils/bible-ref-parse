"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var childProcess = require("child_process");
var lang = process.argv[2];
if (!lang) {
    console.error('Please specify a language identifier as the first argument');
    process.exit(1);
}
var tempGrammarFile = "../temp_".concat(lang, "_grammar.js");
var grammarFile = "../src/".concat(lang, "/grammar.pegjs");
// Run PEG.js to generate grammar file
childProcess.execSync("pegjs --format globals --export-var grammar -o ".concat(tempGrammarFile, " ").concat(grammarFile));
// Add PEG.js global variables
addPegjsGlobal(tempGrammarFile);
console.log('Joining...');
// Concatenate and compile CoffeeScript files
var coffeeFiles = [
    '../src/core/bcv_parser.coffee',
    '../src/core/bcv_passage.coffee',
    '../src/core/bcv_utils.coffee',
    "../src/".concat(lang, "/translations.coffee"),
    "../src/".concat(lang, "/regexps.coffee"),
];
var outputJsFile = "../js/".concat(lang, "_bcv_parser.js");
var coffeeCmd = "cat ".concat(coffeeFiles.join(' '), " | coffee --no-header --compile --stdio > ").concat(outputJsFile);
childProcess.execSync(coffeeCmd);
// Add PEG.js code to output JS file
addPeg(outputJsFile, '');
console.log('Compiling spec...');
// Compile spec CoffeeScript file
var specFile = "../src/".concat(lang, "/spec.coffee");
var specJsFile = "../test/js/".concat(lang, ".spec.js");
childProcess.execSync("coffee --no-header -c ".concat(specFile));
childProcess.execSync("mv ".concat(specFile.replace('.coffee', '.js'), " ").concat(specJsFile));
// Remove temporary grammar file
fs.unlinkSync(tempGrammarFile);
function addPegjsGlobal(file) {
    var content = fs.readFileSync(file, 'utf8');
    var modifiedContent = "var grammar;\n".concat(content);
    modifiedContent.replace(/\broot\.grammar/g, 'grammar');
    fs.writeFileSync(file, modifiedContent);
}
function addPeg(outputFile, prefix) {
    var pegContent = fs.readFileSync(tempGrammarFile, 'utf8');
    var outputFileContent = fs.readFileSync(outputFile, 'utf8');
    var modifiedContent = outputFileContent.replace(/(\s*\}\)\.call\(this\);\s*)$/, "\n".concat(pegContent, "\n$1"));
    if (modifiedContent === outputFileContent) {
        throw new Error('PEG not successfully added');
    }
    fs.writeFileSync(outputFile, modifiedContent);
}
