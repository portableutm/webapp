import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import localeCommonEN from './locales/common.en.json';
import localeAuthEN from './locales/auth.en.json';
import localeAuthES from './locales/auth.es.json';
import localeDashboardEN from './locales/dashboard.en.json';
import localeDashboardES from './locales/dashboard.es.json';

const resources = {
	en: {
		common: localeCommonEN,
		dashboard: localeDashboardEN,
		auth: localeAuthEN
	},
	es: {
		dashboard: localeDashboardES,
		auth: localeAuthES
	}
};

i18n
	.use(initReactI18next) // passes i18n down to react-i18next
	.init({
		resources,
		defaultNS: 'common',
		lng: 'en',
		keySeparator: '.', // We use keys in format .
		interpolation: {
			escapeValue: false // react already safes from xss
		}
	});

export default i18n;