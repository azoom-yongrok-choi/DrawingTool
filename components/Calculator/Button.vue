<template>
  <button @click="$emit('click')" :class="type">
    {{ label }}
    <span class="sparkle" v-if="type === 'operator'">✨</span>
  </button>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'number'
  }
})

defineEmits(['click'])
</script>

<style scoped>
button {
  padding: 18px;     /* 20px에서 감소 */
  font-size: 22px;   /* 24px에서 감소 */
  height: 70px;      /* 고정 높이 추가 */
  border: 3px solid #81C784;
  border-radius: 20px;
  background-color: #fff;
  cursor: pointer;
  color: #2E7D32;
  font-family: 'Comic Sans MS', cursive;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  display: flex;     /* 추가 */
  align-items: center; /* 추가 */
  justify-content: center; /* 추가 */
}

button::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent);
  transform: translateX(-100%);
}

button:hover::after {
  transform: translateX(100%);
  transition: transform 0.5s ease;
}

button:hover {
  background-color: #E8F5E9;
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 6px 12px rgba(46, 125, 50, 0.2);
}

button:active {
  transform: translateY(0) scale(0.95);
}

button.operator {
  background-color: #C8E6C9;
  border-color: #81C784;
  font-weight: bold;
  background-image: linear-gradient(45deg, #C8E6C9, #E8F5E9);
}

.sparkle {
  position: absolute;
  top: 3px;
  right: 3px;
  font-size: 12px;  /* 10px에서 증가 */
}
</style>