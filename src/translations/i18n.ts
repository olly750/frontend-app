import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

export type TranslationPresetsTypes = 'default' | 'nyakinama' | 'fake';

export const TranslationPresets: Array<TranslationPresetsTypes> = [
  'default',
  'nyakinama',
  'fake',
];

export type translationsType = {
  // eslint-disable-next-line no-unused-vars
  [_index in TranslationPresetsTypes]: Record<'translation', any>;
};

async function getTranslations() {
  let resources: Partial<translationsType> = {};

  for await (const val of TranslationPresets) {
    resources[val] = {
      translation: await import(`./${val}/translation.json`),
    };
  }

  // @ts-ignore
  return resources;
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    returnEmptyString: false,
    resources: await getTranslations(),
  });

// i18n.changeLanguage('fake');

export { i18n };
