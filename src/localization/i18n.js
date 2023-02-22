import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './en/translation.json';
import de from './de/translation.json';

i18n.use(initReactI18next).init({
  detection: {
    order: ['localStorage', 'htmlTag'],
  },
  interpolation: {escapeValue: false},
  fallbackLng: 'en',
  load: 'languageOnly',
  compatibilityJSON: 'v3',
  resources: {
    de: {
      common: de,
    },
    en: {
      common: en,
    },
  },
});

export default i18n;
