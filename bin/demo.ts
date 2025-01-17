import fs from 'fs';

const input = `
„Kínoztatott, pedig alázatos volt, és száját nem nyitotta meg, mint bárány, mely mészárszékre vitetik, 
és mint juh, mely megnémul az őt nyírők előtt; és száját nem nyitotta meg!” (Ésa 53:7)
`;

const lang = process.argv[2];

if (!lang || !fs.existsSync(`dist/${lang}-bcv-parser.js`)) {
	console.error(`Invalid Language: ${lang}`);
	console.log('Usage examples: ');
	console.log('\tnpm run demo en');
	console.log('\tnpm run demo es');

	process.exit(1);
}

(async function() {
	// @ts-ignore
	const { default: parserModule} = await import(`../dist/${lang}-bcv-parser.js`);
	const parser = new parserModule.bcv_parser();
	
	const parseResults = parser.parse(input).osis_and_indices();
	console.log('RESULTS', parseResults);
}());