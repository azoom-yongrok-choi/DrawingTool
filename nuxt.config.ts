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
  ssr: true,
  app: {
    baseURL: '/CursorTest1/', // GitHub 저장소 이름으로 변경하세요
    buildAssetsDir: 'assets'
  },
  nitro: {
    preset: 'github-pages'
  }
})
