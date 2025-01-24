<template>
  <nav class="navigation">
    <NuxtLink to="/" class="nav-button">
      🏠 홈
    </NuxtLink>
    <NuxtLink to="/calculator" class="nav-button">
      🧮 계산기
    </NuxtLink>
    <NuxtLink to="/drawing" class="nav-button">
      🎨 그림판
    </NuxtLink>
  </nav>
</template>

<style scoped>
.navigation {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 15px;
  padding: 10px;
  background: rgba(232, 245, 233, 0.9);
  border: 3px solid #81C784;
  border-radius: 50px;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.nav-button {
  padding: 10px 20px;
  background: white;
  border: 2px solid #81C784;
  border-radius: 25px;
  color: #2E7D32;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
}

.nav-button:hover {
  background: #C8E6C9;
  transform: translateY(-2px);
}

.nav-button.router-link-active {
  background: #81C784;
  color: white;
}
</style> 