import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from '../locales/en/translation.json';
import translationTR from '../locales/tr/translation.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: translationEN
            },
            tr: {
                translation: translationTR
            }
        },
        lng: 'tr', // or 'en', depending on the selected language
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;
