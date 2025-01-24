import { createI18n } from 'vue-i18n'
import ko from '../locales/ko.json'
import en from '../locales/en.json'
import ja from '../locales/ja.json'

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'ko',
    fallbackLocale: 'en',
    messages: {
      ko,
      en,
      ja
    }
  })

  vueApp.use(i18n)
})