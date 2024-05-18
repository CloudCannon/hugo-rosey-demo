const markdownit = require('markdown-it');
const {
  NodeHtmlMarkdown,
  NodeHtmlMarkdownOptions,
} = require('node-html-markdown');

const fs = require('file-system');
const YAML = require('yaml');
// const slugify = require('slugify');
// const md = markdownit({
//   html: true,
// });
const nhm = new NodeHtmlMarkdown(
  /* options (optional) */ {},
  /* customTransformers (optional) */ undefined,
  /* customCodeBlockTranslators (optional) */ undefined
);

const inputFilePath = './rosey/base.json';
const translationFilesDirPath = './rosey/translations';
const baseURL = process.env.BASEURL || 'http://localhost:1313/';
let locales = process.env.LOCALES?.toLowerCase().split(',') || [
  'es-es',
  'de-de',
  'fr-fr',
];

async function main(locale) {
  // Get the Rosey generated data
  let inputFileData = {};

  if (fs.existsSync(inputFilePath)) {
    inputFileData = await JSON.parse(fs.readFileSync(inputFilePath)).keys;
  } else {
    console.log('rosey/base.json does not exist');
  }
  // Get all the pages that appear in the base.json
  const translationEntryKeys = Object.keys(inputFileData);
  const translationEntries = translationEntryKeys.map((key) => {
    const entry = inputFileData[key];
    return entry;
  });

  let allPages = [];
  translationEntries.forEach((entry) => {
    const entrysPages = Object.keys(entry.pages);
    entrysPages.forEach((page) => {
      allPages.push(page);
    });
  });
  const pages = allPages.reduce((accumulator, item) => {
    if (!accumulator.includes(item)) {
      accumulator.push(item);
    }
    return accumulator;
  }, []);

  // Loop through the pages
  for (item in pages) {
    const page = pages[item];
    // Format the page name
    const pageName = page
      .replace('/index.html', '/')
      .replace('.html', '')
      .replace('index', 'home');

    // Find the page file path
    const translationFilePath =
      translationFilesDirPath + '/' + locale + '/' + pageName + '.yaml';

    let outputFileData = {};
    let cleanedOutputFileData = {};

    // Get our old translations file
    if (fs.existsSync(translationFilePath)) {
      outputFileData = await YAML.parse(
        fs.readFileSync(translationFilePath, 'utf8')
      );
    } else {
      console.log(`${translationFilePath} does not exist, creating one now`);
      await fs.writeFileSync(translationFilePath, '_inputs: {}');
    }

    for (const inputKey in inputFileData) {
      const inputTranslationObj = inputFileData[inputKey];
      const inputTranslationObjectPages = Object.keys(
        inputTranslationObj.pages
      );
      // If page exists in inputTranslationObj's pages obj as a key
      // Do all of the below otherwise return

      if (inputTranslationObjectPages.includes(page)) {
        const originalPhrase = inputTranslationObj.original.trim();

        // Only add the key to our output data if it still exists in base.json
        // If entry no longer exists in base.json we don't add it
        const outputKeys = Object.keys(outputFileData);
        outputKeys.forEach((key) => {
          if (inputKey === key) {
            cleanedOutputFileData[key] = outputFileData[key];
          }
        });

        // If entry doesn't exist in our output file, add it
        if (!cleanedOutputFileData[inputKey]) {
          cleanedOutputFileData[inputKey] = '';
        }

        // Find the pages the translation appears on, but not tags and categories pages
        // const translationPages = Object.keys(inputTranslationObj.pages).filter(
        //   (page) => {
        //     return (
        //       page !== 'tags/index.html' && page !== 'categories/index.html'
        //     );
        //   }
        // );

        // Write the string to link to the location
        const urlHighlighterWordLength = 3;
        const originalPhraseArray = originalPhrase.split(/[\s\n]+/);
        const startHighlight = encodeURI(
          originalPhraseArray
            .slice(0, urlHighlighterWordLength)
            .join(' ')
            .replaceAll('<p>', '')
            .replaceAll('</p>', '')
        );
        const endHighlight = encodeURI(
          originalPhraseArray
            .slice(
              originalPhraseArray.length - urlHighlighterWordLength,
              originalPhraseArray.length
            )
            .join(' ')
            .replaceAll('<p>', '')
            .replaceAll('</p>', '')
        );
        const encodedOriginalPhrase = encodeURI(
          originalPhrase.replaceAll('<p>', '').replaceAll('</p>', '')
        );
        const pageString = page.replace('.html', '').replace('index', '');
        const locationString =
          originalPhraseArray.length > urlHighlighterWordLength
            ? `[Go to Location](${baseURL}${pageString}#:~:text=${startHighlight},${endHighlight})`
            : `[Go to Location](${baseURL}${pageString}#:~:text=${encodedOriginalPhrase})`;

        // Create the inputs obj if there is none
        if (!cleanedOutputFileData['_inputs']) {
          cleanedOutputFileData['_inputs'] = {};
        }

        // Create the page input object
        if (!cleanedOutputFileData['_inputs']['$']) {
          cleanedOutputFileData['_inputs']['$'] = {
            type: 'object',
            options: {
              place_groups_below: false,
              groups: [
                {
                  heading: 'Untranslated',
                  comment: 'Content to be translated',
                  inputs: [],
                },
                {
                  heading: 'Translated',
                  comment: 'Content already translated',
                  inputs: [],
                },
              ],
            },
          };
        }

        // Add each entry to our _inputs obj - no need to preserve these between translations
        const inputType = originalPhrase.length < 20 ? 'text' : 'textarea';
        const label = nhm.translate(originalPhrase);

        cleanedOutputFileData['_inputs'][inputKey] = {
          label: '',
          hidden: originalPhrase === '' ? true : false,
          type: inputType,
          comment: `
          ${locationString}\n
          ${label}
          `,
        };

        // Add each entry to page object group depending on whether they are translated or not
        // if translation key is an empty string, or is not yet in the output file add it to untranslated
        // else add it to translated
        const unTranslatedPageGroup =
          cleanedOutputFileData['_inputs']['$'].options.groups[0].inputs;

        const translatedPageGroup =
          cleanedOutputFileData['_inputs']['$'].options.groups[1].inputs;

        if (cleanedOutputFileData[inputKey].length > 0) {
          // console.log('translated', inputKey, cleanedOutputFileData[inputKey]);
          translatedPageGroup.push(inputKey);
        } else {
          // console.log('untranslated', inputKey, cleanedOutputFileData[inputKey]);
          unTranslatedPageGroup.push(inputKey);
        }
      }

      await fs.writeFileSync(
        translationFilePath,
        YAML.stringify(cleanedOutputFileData),
        (err) => {
          if (err) throw err;
          console.log(translationFilePath + ' updated succesfully');
        }
      );
    }
  }
}

// Loop through locales
for (let i = 0; i < locales.length; i++) {
  const locale = locales[i];

  main(locale).catch((err) => {
    console.error(`Encountered an error translating ${locale}:`, err);
  });
}

module.exports = { main };
