import * as path from 'path';
import logger from './utils/logger';

const language = process.argv[2] || null;

if (!language || !/^\w+$/.test(language)) {
	logger.error('The first argument should be a language iso code (e.g., "fr")');
	process.exit(1);
}

const rootPath = path.resolve(__dirname, '../');
const srcPath = path.join(rootPath, 'src');
const buildPath = path.join(rootPath, 'build/lang');
const distPath = path.join(rootPath, 'dist');
const testPath = path.join(distPath, 'test');

const CONFIG = {
	language,
	logLevel: process.env.LOG_LEVEL || 'verbose',
	isWindows: process.platform === 'win32',
	paths: {
		root: rootPath,
		core: {
			parser: path.join(srcPath, 'core/bcv-parser.coffee'),
			passage: path.join(srcPath, 'core/bcv-passage.coffee'),
			utils: path.join(srcPath, 'core/bcv-utils.coffee'),
		},
		temp: {
			grammar: path.join(rootPath, `temp-${language}-grammar.js`),
		},
		scripts: {
			makeRegexps: path.join(rootPath, 'bin/make-regexps.js'),
		},
		src: {
			blocks: path.join(srcPath, 'letters/blocks.txt'),
			dataFile: path.join(srcPath, 'lang', language, 'data.txt'),
			letters: path.join(srcPath, 'letters/letters.txt'),
			psalms: path.join(srcPath, 'lang', language, 'psalms-cb.coffee'),
		},
		template: {
			grammar: path.join(srcPath, 'template/grammar.pegjs'),
			regexps: path.join(srcPath, 'template/regexps.coffee'),
			spec: path.join(srcPath, 'template/spec.coffee'),
			translationAlternates: path.join(srcPath, 'template/translation-alternates.coffee'),
			translations: path.join(srcPath, 'template/translations.coffee'),
		},
		build: {
			directory: path.join(buildPath, language),
			bookNames: path.join(buildPath, language, 'book-names.txt'),
			grammar: path.join(buildPath, language, 'grammar.pegjs'),
			regexps: path.join(buildPath, language, 'regexps.coffee'),
			spec: path.join(buildPath, language, 'spec.coffee'),
			specJs: path.join(buildPath, language, 'spec.js'),
			translationAliases: path.join(buildPath, language, 'translation-aliases.coffee'),
			translationAlternates: path.join(buildPath, language, 'translation-alternates.coffee'),
			translations: path.join(buildPath, language, 'translations.coffee'),
		},
		dist: {
			directory: distPath,
			js: path.join(distPath, `${language}-bcv-parser.js`),
		},
		tests: {
			directory: testPath,
			specTestJs: path.join(testPath, `${language}.spec.js`),
		},
	}
}

export {
	CONFIG,
}
