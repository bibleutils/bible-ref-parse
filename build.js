#!/usr/bin/env node
const yargs = require('yargs');
const fs = require('fs');
const childProcess = require('child_process');

const usage = 'Usage build.js <language|all> --help';
const argv = yargs
	.usage(usage)
	.option('l', { alias: 'lang', describe: 'Language to build', type: 'string', demandOption: false })
	.option('ls', { alias: 'list', describe: 'List available languages', type: 'boolean', demandOption: false })
	.help(true)
	.argv;

function getLanguagesList() {
	return fs.readdirSync('./src/lang');
}

function addLanguage (lang) {
	const command = `LOG_LEVEL=silent npm run add-language -- ${lang}`;

	try {
		childProcess.execSync(command);
	} catch (error) {
		console.error(`Failed to add language ${lang}: ${error}`);
		process.exit(1);
	}
}

function compileLanguage (lang) {
	const command = `LOG_LEVEL=silent npm run compile-language -- ${lang}`;

	try {
		childProcess.execSync(command);
	} catch (error) {
		console.error(`Failed to build language ${lang}: ${error}`);
		process.exit(1);
	}
}

function minify (lang) {
	const command = `npm run minify -- dist/${lang}-bcv-parser.js -o dist/${lang}-bcv-parser.min.js -c -m`;

	try {
		childProcess.execSync(command);
	} catch (error) {
		console.error(`Failed to minify language ${lang}: ${error}`);
		process.exit(1);
	}
}

const availableLanguages = getLanguagesList();

function processLanguage (lang) {
	addLanguage(lang);
	compileLanguage(lang);
	minify(lang);
	console.log(`Processed language: ${lang}`);
}

if (argv.ls) {
	console.log(getLanguagesList());
	process.exit(0);
}

if (!argv._.length) {
	console.error('No language specified');
	console.error(usage);
	process.exit(1);
}

if (argv._.length > 1) {
	const unsupportedLanguages = argv._.filter(lang => !availableLanguages.includes(lang));

	if (unsupportedLanguages.length) {
		console.error(`Unsupported languages: ${unsupportedLanguages.join(', ')}`);
		process.exit(1);
	}

	for (let lang of argv._) {
		processLanguage(lang);
	}
	process.exit(0);
}

if (argv._[0] === 'all') {
	for (let lang of availableLanguages) {
		processLanguage(lang);
	}
	process.exit(0);
}

if (availableLanguages.includes(argv._[0])) {
	processLanguage(argv._[0]);
	process.exit(0);
}

console.error(`Unsupported language: ${argv._[0]}`);
process.exit(1);

