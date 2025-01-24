import { createI18n } from 'vue-i18n'

const messages = {
  ko: {
    tools: {
      brush: '브러시',
      eraser: '지우개',
      magicwand: '매직완드',
      upload: '이미지 업로드',
      undo: '실행 취소',
      redo: '다시 실행',
      clear: '모두 지우기'
    },
    settings: {
      brushSize: '브러시 크기',
      tolerance: '허용치',
      px: '픽셀',
      percent: '%'
    },
    language: {
      ko: '한국어',
      en: 'English',
      ja: '日本語'
    }
  },
  en: {
    tools: {
      brush: 'Brush',
      eraser: 'Eraser',
      magicwand: 'Magic Wand',
      upload: 'Upload Image',
      undo: 'Undo',
      redo: 'Redo',
      clear: 'Clear All'
    },
    settings: {
      brushSize: 'Brush Size',
      tolerance: 'Tolerance',
      px: 'px',
      percent: '%'
    },
    language: {
      ko: '한국어',
      en: 'English',
      ja: '日本語'
    }
  },
  ja: {
    tools: {
      brush: 'ブラシ',
      eraser: '消しゴム',
      magicwand: 'マジックワンド',
      upload: '画像アップロード',
      undo: '元に戻す',
      redo: 'やり直し',
      clear: 'すべて消去'
    },
    settings: {
      brushSize: 'ブラシサイズ',
      tolerance: '許容値',
      px: 'ピクセル',
      percent: '%'
    },
    language: {
      ko: '한국어',
      en: 'English',
      ja: '日本語'
    }
  }
}

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en',
    messages
  })

  vueApp.use(i18n)
})