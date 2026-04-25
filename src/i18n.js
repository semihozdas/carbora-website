import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import en from './locales/en/translation.json';
import tr from './locales/tr/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      tr: { translation: tr },
      en: { translation: en },
    },
    fallbackLng: 'tr',
    supportedLngs: ['tr', 'en'],
    load: 'languageOnly',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// Keep <html lang="..."> in sync for accessibility/SEO.
try {
  document.documentElement.lang = i18n.language || 'tr';
  i18n.on('languageChanged', (lng) => {
    document.documentElement.lang = lng;
  });
} catch {
  // no-op (e.g., SSR)
}

export default i18n;

