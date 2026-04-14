const fs = require('fs');

const inputFile = 'defaultVerseCounts.json';
const defaultVerseCounts = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

function saveVerifications(books) {
  const result = {};

  for (const [osis, chapters] of Object.entries(books)) {
    const versesCount = {};
    chapters.forEach((verses, index) => {
      versesCount[index + 1] = verses;
    });
    result[osis] = {
      chaptersCount: chapters.length,
      versesCount,
    };
  }

  const outputFile = `defaultVerseCounts_new.json`;
  fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
  console.log(`Written to ${outputFile}`);
}

saveVerifications(defaultVerseCounts);
