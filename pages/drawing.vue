<template>
  <div class="drawing-page">
    <h1>
      <span class="star left">🌟</span>
      {{ $t('drawing.title') }}
      <span class="star right">🌟</span>
    </h1>
    <div class="drawing-container">
      <DrawingBoard />
    </div>
    <div class="kawaii-footer">
      ₍ᐢ. ̫ .ᐢ₎
    </div>
  </div>
</template>

<style scoped>
.drawing-page {
  min-height: 100vh;
  max-height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

h1 {
  text-align: center;
  color: #2E7D32;
  font-size: 28px;
  margin: 0 0 10px 0;
  flex-shrink: 0;
}

.drawing-container {
  flex: 1;
  min-height: 0;
  position: relative;
  background: #E8F5E9;
  border-radius: 20px;
  padding: 10px;
  box-shadow: 
    0 10px 25px -5px rgba(46, 125, 50, 0.3),
    0 0 20px -5px rgba(0, 0, 0, 0.1);
  border: 4px solid #81C784;
  display: flex;
  overflow: hidden;
}

.kawaii-footer {
  text-align: center;
  margin-top: 10px;
  color: #2E7D32;
  font-size: 16px;
  flex-shrink: 0;
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
</style> 