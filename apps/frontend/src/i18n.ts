import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ru: {
    translation: {
      niche: 'Ниша',
      uploadCsv: 'Загрузить CSV/скрин — экспресс-аудит',
      connectAds: 'Подключить Ads Manager за $10/мес',
      trafficLight: 'Светофор кампаний',
      actionsNow: '3 действия сейчас',
      creativesBattle: 'Битва креативов',
      whatIf: 'Что если…',
      pdfForPartner: 'PDF для партнёра',
      ctrHint: 'CTR = кликабельность'
    }
  },
  en: {
    translation: {
      niche: 'Niche',
      uploadCsv: 'Upload CSV/screenshot — express audit',
      connectAds: 'Connect Ads Manager for $10/mo',
      trafficLight: 'Campaign traffic light',
      actionsNow: '3 actions now',
      creativesBattle: 'Creatives battle',
      whatIf: 'What if…',
      pdfForPartner: 'PDF for partner',
      ctrHint: 'CTR = click-through rate'
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ru',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;



