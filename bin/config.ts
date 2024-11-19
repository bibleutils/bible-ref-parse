import * as path from 'path';

const language = process.argv[2] || null;

if (!language) {
	console.error('Please specify a language identifier as the first argument');
	process.exit(1);
}

const rootPath = path.resolve(__dirname, '../');
const srcPath = path.join(rootPath, 'src');
const testPath = path.join(rootPath, 'test');

const CONFIG = {
	language,
	isWindows: process.platform === 'win32',
	paths: {
		root: rootPath,
		core: {
			parser: path.join(srcPath, 'core/bcv_parser.coffee'),
			passage: path.join(srcPath, 'core/bcv_passage.coffee'),
			utils: path.join(srcPath, 'core/bcv_utils.coffee'),
		},
		temp: {
			grammar: path.join(rootPath, `temp_${language}_grammar.js`),
		},
		scripts: {
			makeRegexps: path.join(rootPath, 'bin/make_regexps.js'),
		},
		src: {
			blocks: path.join(rootPath, 'bin/letters/blocks.txt'),
			dataFile: path.join(srcPath, 'lang', language, 'data.txt'),
			letters: path.join(rootPath, 'bin/letters/letters.txt'),
		},
		template: {
			grammar: path.join(srcPath, 'template/grammar.pegjs'),
			regexps: path.join(srcPath, 'template/regexps.coffee'),
			spec: path.join(srcPath, 'template/spec.coffee'),
			specRunner: path.join(srcPath, 'template/SpecRunner.html'),
			translationAlternates: path.join(srcPath, 'lang', 'en', 'translation_alternates.coffee'),
			translations: path.join(srcPath, 'template/translations.coffee'),
		},
		build: {
			bookNames: path.join(srcPath, 'lang', language, 'book-names.txt'),
			grammar: path.join(srcPath, 'lang', language, 'grammar.pegjs'),
			psalms: path.join(srcPath, 'lang', language, 'psalm_cb.coffee'),
			regexps: path.join(srcPath, 'lang', language, 'regexps.coffee'),
			spec: path.join(srcPath, 'lang', language, 'spec.coffee'),
			translationAliases: path.join(srcPath, 'lang', language, 'translation_aliases.coffee'),
			translationAlternates: path.join(srcPath, 'lang', language, 'translation_alternates.coffee'),
			translations: path.join(srcPath, 'lang', language, 'translations.coffee'),
		},
		dist: {
			js: path.join(rootPath, 'js', `${language}_bcv_parser.js`),
			specJs: path.join(srcPath, 'lang', language, 'spec.js'),
			specTestJs: path.join(testPath, 'js', `${language}.spec.js`),
		},
		tests: {
			specRunner: path.join(testPath, `${language}.html`),
		},
	}
}

const COMMANDS = {
	makeRegexps: `node ${CONFIG.paths.scripts.makeRegexps}`,
}

export {
	CONFIG,
	COMMANDS,
}
