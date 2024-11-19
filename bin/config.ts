import * as path from 'path';

const language = process.argv[2] || null;
const rootPath = path.resolve(__dirname, '../');
const srcPath = path.join(rootPath, 'src');
const testPath = path.join(rootPath, 'test');

const CONFIG = {
	language,
	paths: {
		root: rootPath,
		scripts: {
			makeRegexps: path.join(rootPath, 'bin/make_regexps.js'),
		},
		src: {
			blocks: path.join(rootPath, 'bin/letters/blocks.txt'),
			dataFile: path.join(srcPath, 'lang', language, 'data.txt'),
			defaultTranslationAlternates: path.join(srcPath, 'lang', 'en', 'translation_alternates.coffee'),
			letters: path.join(rootPath, 'bin/letters/letters.txt'),
		},
		template: {
			grammar: path.join(srcPath, 'template/grammar.pegjs'),
			regexps: path.join(srcPath, 'template/regexps.coffee'),
			spec: path.join(srcPath, 'template/spec.coffee'),
			specRunner: path.join(srcPath, 'template/SpecRunner.html'),
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
