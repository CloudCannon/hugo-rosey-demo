const fs = require('file-system');
const YAML = require('yaml');

let translationsDirPath = './rosey/translations';
let localesDirPath = './rosey/locales';
let locales = process.env.LOCALES.toLowerCase().split(',');
// let locales = ['es-es'];
let localesFileData = {};
let translationsFileData = {};

async function main(locale) {
  // Read the translation files and the locales files
  let localePath = localesDirPath + '/' + locale + '.json';
  let translationsPath = translationsDirPath + '/' + locale + '.yaml';
  if (fs.existsSync(translationsPath)) {
    translationsFileData = YAML.parse(
      fs.readFileSync(translationsPath, 'utf-8')
    );
  } else {
    console.log(`${translationsPath} does not exist`);
  }
  if (fs.existsSync(localePath)) {
    // localesFileData = JSON.parse(fs.readFileSync(localePath));
    localesFileData = {};
  } else {
    console.log(`${localePath} does not exist, creating one now`);
    fs.writeFileSync(localePath, JSON.stringify({}));
  }

  // Add each obj to our locales data, excluding '_inputs' object.
  for (const inputKey in translationsFileData) {
    const translationEntry = translationsFileData[inputKey];
    const translationEntryInputData = translationsFileData['_inputs'];

    // If obj doesn't exist in our locales file or has a blank value, and isn't the inputs object, add it with the translated value
    if (inputKey !== '_inputs') {
      localesFileData[inputKey] = {
        original: translationEntryInputData[inputKey]?.label,
        value:
          translationEntry == ''
            ? translationEntryInputData[inputKey]?.label
            : translationEntry,
      };
    }
  }

  // Write locales data
  fs.writeFile(localePath, JSON.stringify(localesFileData), (err) => {
    if (err) throw err;
    console.log(localePath + ' updated succesfully');
  });
}

// Loop through locales
for (let i = 0; i < locales.length; i++) {
  const locale = locales[i];

  main(locale).catch((err) => {
    console.error(`Encountered an error translating ${locale}:`, err);
  });
}

module.exports = { main };
