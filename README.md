# Hugo Rosey Bookshop Starter

A starter template for a new Hugo site built with [Bookshop](https://github.com/CloudCannon/bookshop) components.
This template uses [Rosey](https://rosey.app/) to generate a multilingual site from one language.
We run Rosey on your built site in the CloudCannon postbuild.
Rosey generates a base.json file wherever it detects a `data-rosey=""` tag in your built site.
From this base.json file we run a script that creates a locales file for each locale listed in your LOCALES environment variable.
Editors can see these locales files in the CloudCannon UI, and enter translations for each phrase.
Rosey then uses the locales files, to generate a multilingual site.

## Local Development

To run site locally:

```bash
npm i
npm start
```

To run Rosey locally:

```bash
npm i
hugo
npx rosey generate --source public
node utils/generateLocales.js
```

Enter a translated value in one of the locale files.
To generate a multilingual site locally:

```bash
npx rosey build --source public --dest public_translated
```

## Environment Variables

The `SYNC_PATHS=/rosey/` environment variable tells CloudCannon to sync the generated data in the `/rosey/` directory from our postbuild back to the source repository.

The `TRANSLATE=true` environment variable tells CloudCannon to generate a site from the locales folder. Only set this to `true` on the production site. Setting this to `true` on our staging sites can interfere with CloudCannon's UI.

The `LOCALES=fr-fr,de-de,es-es` tells CloudCannon to generate locale files for language codes 'fr-fr', 'de-de', and 'es-es'. Set this value to whichever languages you would like to generate with Rosey. Language codes should follow the placeholder format provided, and are separated by a comma.

## v2

This will be what the user fills out translations in.
We generate this from base.json, and env vars
We generate locales files from the translation files, which we then run Rosey on.
Group by page the translation appears on

- groups have a comment which can support markdown
- test whether we can page anchor with editor links
  - if so we probably need to use the

### An example output for our translations data file

```yaml
_inputs:
  some-text-to-be-translated:
    label: Some text to be translated
    type: textarea
    comment: >-
      Locations:

        - [Home](collections/pages/:/edit?editor=visual&url=%2F&path=%2Fcontent%2F_index.md&collection=pages) 
        - [About](collections/pages/:/edit?editor=visual&url=%2F&path=%2Fcontent%2F_index.md&collection=pages)
  a-test-string:
    label: A test string
    type: textarea
    comment: >-
      Locations:
        - [Home](collections/pages/:/edit?editor=visual&url=%2F&path=%2Fcontent%2F_index.md&collection=pages)
  an-empty-test-string:
    label: An empty test string
    type: textarea
    comment: >-
      Locations:
        - [Home](collections/pages/:/edit?editor=visual&url=%2F&path=%2Fcontent%2F_index.md&collection=pages)
  nice-little-fluffy-clouds-laying-around-in-the-sky-being-lazy-i-like-to-beat-the-brush-let's-make-some-happy-little-clouds-in-our-world-the-least-little-bit-can-do-so-much-let's-get-wild-today-trees-grow-however-makes-them-happy:
    label: Nice little fluffy clouds laying around in the sky being lazy. I like to beat the brush. Let's make some happy little clouds in our world. The least little bit can do so much. Let's get wild today. Trees grow however makes them happy.
    type: textarea
    comment: >-
      Locations:
        - [Home](collections/pages/:/edit?editor=visual&url=%2F&path=%2Fcontent%2F_index.md&collection=pages)
some-text-to-be-translated: 'algún texto para traducir'
a-test-string: 'una cadena de prueba'
an-empty-test-string: ''
nice-little-fluffy-clouds-laying-around-in-the-sky-being-lazy-i-like-to-beat-the-brush-let's-make-some-happy-little-clouds-in-our-world-the-least-little-bit-can-do-so-much-let's-get-wild-today-trees-grow-however-makes-them-happy: ''
```
