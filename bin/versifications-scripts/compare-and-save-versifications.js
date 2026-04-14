const fs = require('fs');
const path = require('path');

const resultDir = path.join(__dirname, 'result');
const diffResultDir = path.join(__dirname, 'diff_result');
const defaultPath = path.join(__dirname, 'defaultVerseCounts_new.json');

const defaultData = JSON.parse(fs.readFileSync(defaultPath, 'utf8'));

if (!fs.existsSync(diffResultDir)) {
  fs.mkdirSync(diffResultDir);
}

const files = fs.readdirSync(resultDir).filter(f => f.endsWith('.json'));

for (const file of files) {
  const loaded = JSON.parse(fs.readFileSync(path.join(resultDir, file), 'utf8'));
  const diff = {};

  for (const bookName of Object.keys(loaded)) {
    const loadedBook = loaded[bookName];
    const defaultBook = defaultData[bookName];

    const bookDiff = {};

    if (!defaultBook || loadedBook.chaptersCount !== defaultBook.chaptersCount) {
      bookDiff.chaptersCount = loadedBook.chaptersCount;
    }

    const versesCountDiff = {};
    for (const chapterNum of Object.keys(loadedBook.versesCount)) {
      if (!defaultBook || !(chapterNum in defaultBook.versesCount)) {
        // chapter missing in default — save it
        versesCountDiff[chapterNum] = loadedBook.versesCount[chapterNum];
      } else if (loadedBook.versesCount[chapterNum] !== defaultBook.versesCount[chapterNum]) {
        versesCountDiff[chapterNum] = loadedBook.versesCount[chapterNum];
      }
    }

    if (Object.keys(versesCountDiff).length > 0) {
      bookDiff.versesCount = versesCountDiff;
    }

    if (Object.keys(bookDiff).length > 0) {
      diff[bookName] = bookDiff;
    }
  }

  if (Object.keys(diff).length > 0) {
    fs.writeFileSync(
      path.join(diffResultDir, file),
      JSON.stringify(diff, null, 2),
      'utf8'
    );
    console.log(`${file}: ${Object.keys(diff).length} differing book(s)`);
  }
}
