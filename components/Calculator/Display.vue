<template>
  <div class="display-wrapper">
    <div class="display">{{ value }}</div>
    <div class="kawaii-face">
      {{ value === '0' ? '(｡◕‿◕｡)' : '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧' }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  value: {
    type: String,
    default: '0'
  }
})
</script>

<style scoped>
.display-wrapper {
  background-color: #E8F5E9;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 20px;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 3px solid #81C784;
  position: relative;
}

.display {
  text-align: right;
  font-size: 32px;   /* 36px에서 감소 */
  min-height: 60px;  /* 고정 높이 추가 */
  display: flex;     /* 추가 */
  align-items: center; /* 추가 */
  justify-content: flex-end; /* 추가 */
  color: #2E7D32;
  font-family: 'Comic Sans MS', cursive;
  padding: 15px;
  background: white;
  border-radius: 15px;
  border: 2px dashed #81C784;
}

.kawaii-face {
  text-align: center;
  font-size: 18px;   /* 14px에서 증가 */
  color: #2E7D32;
  margin-top: 8px;
}
</style>