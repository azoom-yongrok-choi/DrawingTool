// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true }, devServer: {
    port: 3001
  },
  imports: {
    dirs: ['composables/**',
      'components/**',
    ]
  },
  ssr: false,
  app: {
    baseURL: '/DrawingTool/', // GitHub 저장소 이름으로 변경
    buildAssetsDir: 'assets'
  },
  nitro: {
    preset: 'github-pages'
  },
  plugins: [
    '~/plugins/i18n.ts'
  ]
})
