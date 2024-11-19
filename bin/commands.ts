import { CONFIG } from './config';

const COMMANDS = {
	makeRegexps (content: string): string {
		return `node ${CONFIG.paths.scripts.makeRegexps} "${content}"`;
	},
	compileGrammar (): string {
		const defaultCommand = `npx pegjs --format globals --export-var grammar -o ${CONFIG.paths.temp.grammar} ${CONFIG.paths.build.grammar}`;

		if (CONFIG.isWindows) {
			return `powershell -Command "${defaultCommand}"`;
		}

		return defaultCommand;
	},
	compileParser (filesList: string[]): string {
		if (CONFIG.isWindows) {
			const commaSeparatedPaths = filesList.map(file => "'" + file.replace("'", "''") + "'").join(', ');
			return `powershell -Command "Get-Content -Path @(${commaSeparatedPaths}) | npx coffee --no-header --compile --stdio | Out-File -FilePath '${CONFIG.paths.dist.js}' -Encoding UTF8"`;
		}

		return `cat ${filesList.join(' ')} | coffee --no-header --compile --stdio > ${CONFIG.paths.dist.js}`;
	},
	compileSpec (): string {
		return `npx coffee --no-header -c ${CONFIG.paths.build.spec}`;
	},
	moveSpecJs (): string {
		if (CONFIG.isWindows) {
			return `powershell -Command "Move-Item -Path ${CONFIG.paths.build.specJs} -Destination ${CONFIG.paths.dist.specTestJs}"`;
		}

		return `mv ${CONFIG.paths.build.specJs} ${CONFIG.paths.dist.specTestJs}`;
	},
}

export {
	COMMANDS,
}
