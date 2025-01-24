<template>
  <div class="buttons">
    <CalculatorButton 
      v-for="n in 9" 
      :key="n" 
      :label="n.toString()"
      @click="$emit('number', n)" 
    />
    <CalculatorButton label="0" @click="$emit('number', 0)" />
    <CalculatorButton label="C" type="operator" @click="$emit('clear')" />
    <CalculatorButton label="+" type="operator" @click="$emit('operator', '+')" />
    <CalculatorButton label="-" type="operator" @click="$emit('operator', '-')" />
    <CalculatorButton label="×" type="operator" @click="$emit('operator', '*')" />
    <CalculatorButton label="÷" type="operator" @click="$emit('operator', '/')" />
    <CalculatorButton label="=" type="operator" @click="$emit('calculate')" />
  </div>
</template>

<script setup>
defineEmits(['number', 'operator', 'clear', 'calculate'])
</script>

<style scoped>
.buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;        /* 12px에서 증가 */
  padding: 10px;    /* 15px에서 감소 */
}
</style>