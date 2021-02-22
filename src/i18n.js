import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import localeCommonEN from './locales/en/common.json';
import localeCommonES from './locales/es/common.json';
import localeAuthEN from './locales/en/auth.json';
import localeAuthES from './locales/es/auth.json';
import localeDashboardEN from './locales/en/dashboard.json';
import localeDashboardES from './locales/es/dashboard.json';
import localeGlossaryEN from './locales/en/glossary.json';
import localeGlossaryES from './locales/es/glossary.json';
import localeMapEN from './locales/en/map.json';
import localeMapES from './locales/es/map.json';

const resources = {
	en: {
		common: localeCommonEN,
		dashboard: localeDashboardEN,
		auth: localeAuthEN,
		glossary: localeGlossaryEN,
		map: localeMapEN
	},
	es: {
		common: localeCommonES,
		dashboard: localeDashboardES,
		auth: localeAuthES,
		glossary: localeGlossaryES,
		map: localeMapES
	}
};

i18n
	.use(initReactI18next) // passes i18n down to react-i18next
	.init({
		resources,
		defaultNS: 'common',
		lng: 'es',
		keySeparator: '.', // We use keys in format .
		interpolation: {
			escapeValue: false // react already safes from xss
		}
	});

export default i18n;