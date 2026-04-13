const fs = require('fs');

const inputFile = 'defaultBiblePerLang.json';
const defaultBiblePerLang = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

function saveVerifications(lang, bibleId, books) {
  const result = {};

  for (const [osis, chapters] of Object.entries(books)) {
    const versesCount = {};
    chapters.forEach((verses, index) => {
      versesCount[index + 1] = verses.length;
    });
    result[osis] = {
      chaptersCount: chapters.length,
      versesCount,
    };
  }

  const outputFile = `result/${lang}_${bibleId}_versifications.json`;
  fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
  console.log(`Written to ${outputFile}`);
}

async function main() {
  for (const [lang, bibleId] of Object.entries(defaultBiblePerLang)) {
    const url = `https://app.sdarm.org/bible/data/${bibleId}.json`;
    console.log(`Fetching ${lang}: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      continue;
    }
    const data = await response.json();
    saveVerifications(lang, bibleId, data.books);
  }
}

main().catch(console.error);
