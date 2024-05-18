const fs = require('file-system');
const YAML = require('yaml');

const translationsDirPath = './rosey/translations';
const localesDirPath = './rosey/locales';

const locales = process.env.LOCALES?.toLowerCase().split(',') || [
  'es-es',
  'de-de',
  'fr-fr',
];

async function main(locale) {
  const baseFile = await fs.readFileSync('./rosey/base.json');
  const roseyJSON = JSON.parse(baseFile).keys;
  let translationsFileData = [];
  let localeData = {};
  const localePath = localesDirPath + '/' + locale + '.json';
  const translationsLocalePath = translationsDirPath + '/' + locale + '/';

  const translationsFiles = await fs.readdirSync(translationsLocalePath);
  for (item in translationsFiles) {
    const file = translationsFiles[item];
    const translationsPath = translationsLocalePath + file;

    if (fs.existsSync(translationsPath)) {
      const data = YAML.parse(fs.readFileSync(translationsPath, 'utf-8'));
      translationsFileData.push(data);
    } else {
      console.log(`${translationsPath} does not exist`);
    }
    // // Add each obj to our locales data, excluding '_inputs' object.
    for (item in translationsFileData) {
      const page = translationsFileData[item];

      for (const key in page) {
        const translationEntry = page[key];

        // If obj doesn't exist in our locales file or has a blank value, and isn't the inputs object, add it with the translated value
        if (key !== '_inputs') {
          localeData[key] = {
            original: roseyJSON[key]?.original,
            value:
              translationEntry == ''
                ? roseyJSON[key]?.original
                : translationEntry,
          };
        }
      }
    }
  }
  // Write locales data
  fs.writeFileSync(localePath, JSON.stringify(localeData), (err) => {
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
