# Hugo Rosey Bookshop Starter

A starter template for a new Hugo site built with [Bookshop](https://github.com/CloudCannon/bookshop) components.
This template uses [Rosey](https://rosey.app/) to generate a multilingual site from an English version of the site, and some translation files.
Editors can enter translations manually for different languages, all in one place.

Rosey generates a base.json file wherever it detects a `data-rosey=""` tag in your built site.
From this `base.json` file we run a script that creates a translations file for each locale listed in your `LOCALES` environment variable.
Editors can see an input for each translation in the CloudCannon UI, and can enter a translated value.
We then run a script in our postbuild to generate the [locales files that Rosey expects](https://rosey.app/docs/#creating-locale-files) to create our multilingual site from.
Rosey then uses these locales files, to generate a multilingual site.

## Getting Started

- To start using this template, go to the [GitHub repository](https://github.com/CloudCannon/hugo-rosey-demo/), and click `Use this template` to make your own copy.
- Build the site on CloudCannon.
- Create a staging site, with the environment variable `TRANSLATE=false`
- Create a production site, with the environment variable `TRANSLATE=false`
- Add the locales you want to translate to to the `LOCALES` environment variable, following the format `es-es`, with each locale separated by a comma.
- Add the environment variable `SYNC_PATHS=/rosey/` to the staging site.
- Enter a translation, wait for the build to finish, and publish to your production site.
- Navigate to the adjective-noun.cloudvent.net address for your production site, and see Rosey redirect to your default browser language.

## Adding Translations

When you add a new component using the placeholder `Hero`, or `LeftRight` components, an entry is added to our translations files to allow an editor to provide a translation.
Once our build finishes, we can publish our translations on `staging` to our `main` branch, and Rosey will use them to generate a multilingual site for us.
To create your own components that add inputs to our translation files, add a `data-rosey=""` tag following the format provided in the placeholder components.
For example:

```html
{{ $c := "hero" }}

<div class="{{ $c }}">
  <div class="{{ $c }}__wrapper">
    {{ with .heading }}
    <h1 data-rosey="{{ . | anchorize}}">{{ . }}</h1>
    {{ end }} {{ with .text }}
    <p data-rosey="{{ . | anchorize }}">{{ . | markdownify }}</p>
    {{ end }} {{ with .button }} {{ partial "bookshop" . }} {{ end }}
  </div>
</div>
```

## Environment Variables

The `SYNC_PATHS=/rosey/` environment variable tells CloudCannon to sync the generated data in the `/rosey/` directory from our postbuild back to the source repository.

The `TRANSLATE=true` environment variable tells Rosey to generate a site from the data in the locales folder.
Only set this to `true` on the production site.
Setting this to `true` on our staging site will interfere with CloudCannon's UI, and mean we can't enter translations, or edit pages.

The `LOCALES=fr-fr,de-de,es-es` tells CloudCannon to generate locale files for language codes 'fr-fr', 'de-de', and 'es-es'.
Set this value to whichever languages you would like to generate with Rosey.
Language codes should follow the placeholder format provided, and are separated by a comma.

The `BASEURL=https://adjective-noun.cloudvent.net/` is used to generate locations of the phrase you are translating.
This would usually be set to our staging site's preview URL, although extra logic could be added to send you to the translated version (main/production site's preview URL) instead.

## Local Development & Testing

To run site locally:

```bash
npm i
npm start
```

To run Rosey locally:

```bash
hugo
npx rosey generate --source public
node utils/generateTranslationFiles.js
node utils/generateLocales.js
```

To generate a multilingual site locally, run this after running the above commands:

```bash
npx rosey build --source public --dest public_translated
```

## Coming Soon - v3:

- Have both an 'all' translations page for each locale, and broken down by page
  - Would need to worry about which file wins if both are filled out with different values
    - If translations are filled out on one of the individual pages, as well as the 'all' page the more specific individual page should win (this lets us use the cascade nicely)
  - Would be able to search on the all page, but also navigate the translations easily by page.
- Needs to test phrases with markdown and html content in them
- Integrate with an external service
  - Have the result of the external service populate the translations input so editors can check and edit the auto translation
- Potentially add a Rosey config file so we can choose options, as this example grows
  - Break down translation files by pages, or just as one file

## An example output for our translations data file

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
