import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en'
import zh from './zh'

const savedLang = (() => {
  try {
    return localStorage.getItem('language') || 'en'
  } catch {
    return 'en'
  }
})()

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
    },
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem('language', lng)
  } catch {}
})

export default i18n
