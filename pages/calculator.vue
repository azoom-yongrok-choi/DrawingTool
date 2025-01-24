<template>
  <div class="page-wrapper">
    <div class="calculator">
      <h1>
        <span class="star left">🌟</span>
        귀여운 계산기
        <span class="star right">🌟</span>
      </h1>
      <div class="calculator-inner">
        <CalculatorDisplay :value="display" />
        <CalculatorKeypad
          @number="addNumber"
          @operator="addOperator"
          @clear="clear"
          @calculate="calculate"
        />
      </div>
      <div class="kawaii-footer">
        ₍ᐢ. ̫ .ᐢ₎
      </div>
    </div>
  </div>
</template>

<script setup>
const { display, addNumber, clear, addOperator, calculate } = useCalculator()
</script>

<style scoped>
.page-wrapper {
  padding: 10px;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.calculator {
  max-width: 600px;
  width: 90%;
  margin: 10px auto;
  padding: 20px;
  border: 4px solid #81C784;
  border-radius: 30px;
  background-color: #E8F5E9;
  box-shadow: 
    0 10px 25px -5px rgba(46, 125, 50, 0.3),
    0 0 20px -5px rgba(0, 0, 0, 0.1);
  position: relative;
}

.calculator-inner {
  background: white;
  padding: 15px;
  border-radius: 20px;
  border: 2px dashed #81C784;
}

h1 {
  font-size: 24px;
  margin-bottom: 15px;
  color: #2E7D32;
}

.star {
  animation: twinkle 1.5s infinite;
}

.star.right {
  animation-delay: 0.75s;
}

@keyframes twinkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

.kawaii-footer {
  text-align: center;
  margin-top: 10px;
  color: #2E7D32;
  font-size: 16px;
}
</style> 