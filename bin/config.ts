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
			parser: path.join(srcPath, 'core/bcv-parser.ts'),
			passage: path.join(srcPath, 'core/bcv-passage.ts'),
			utils: path.join(srcPath, 'core/bcv-utils.ts'),
		},
		temp: {
			grammar: path.join(rootPath, `temp-${language}-grammar.js`),
		},
		scripts: {
			makeRegexps: path.join(rootPath, 'bin/make-regexps.js'),
		},
		src: {
			blocks: path.join(srcPath, 'letters/blocks.txt'),
			dataFile: path.join(srcPath, 'lang', language, 'data.json'),
			letters: path.join(srcPath, 'letters/letters.txt'),
			psalms: path.join(srcPath, 'lang', language, 'psalms-cb.ts'),
		},
		template: {
			grammar: path.join(srcPath, 'template/grammar.pegjs'),
			regexps: path.join(srcPath, 'template/regexps.ts'),
			spec: path.join(srcPath, 'template/spec.ts'),
			translationAlternates: path.join(srcPath, 'template/translation-alternates.ts'),
			translations: path.join(srcPath, 'template/translations.ts'),
		},
		build: {
			directory: path.join(buildPath, language),
			bookNames: path.join(buildPath, language, 'book-names.txt'),
			grammar: path.join(buildPath, language, 'grammar.pegjs'),
			regexps: path.join(buildPath, language, 'regexps.ts'),
			spec: path.join(buildPath, language, 'spec.ts'),
			specNew: path.join(buildPath, language, 'spec.ts'),
			specJs: path.join(buildPath, language, 'spec.js'),
			translationAliases: path.join(buildPath, language, 'translation-aliases.ts'),
			translationAlternates: path.join(buildPath, language, 'translation-alternates.ts'),
			translations: path.join(buildPath, language, 'translations.ts'),
		},
		dist: {
			directory: distPath,
			js: path.join(distPath, `${language}-bcv-parser.js`),
			jsMin: path.join(distPath, `${language}-bcv-parser.min.js`),
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
