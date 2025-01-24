<template>
  <div class="language-selector">
    <select v-model="currentLocale" :aria-label="$t('settings.language')">
      <option value="ko">{{ $t('language.ko') }}</option>
      <option value="en">{{ $t('language.en') }}</option>
      <option value="ja">{{ $t('language.ja') }}</option>
    </select>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const currentLocale = computed({
  get: () => locale.value,
  set: (value) => locale.value = value
})
</script>

<style scoped>
.language-selector {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  background: rgba(232, 245, 233, 0.9);
  padding: 10px;
  border: 3px solid #81C784;
  border-radius: 25px;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

select {
  padding: 8px 12px;
  border: 2px solid #81C784;
  border-radius: 15px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  color: #2E7D32;
  outline: none;
  transition: all 0.3s ease;
}

select:hover {
  background: #C8E6C9;
}

select:focus {
  border-color: #2E7D32;
  box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.2);
}
</style> 