<template>
<div class="welcome-page">
    <div class="welcome-content">
    <h1>
        <span class="star left">🌟</span>
        귀여운 앱 모음
        <span class="star right">🌟</span>
    </h1>
    <div class="app-cards">
        <NuxtLink to="/calculator" class="app-card">
        <div class="app-icon">🧮</div>
        <h2>계산기</h2>
        <p>귀여운 계산기로 계산해보세요!</p>
        </NuxtLink>
        <NuxtLink to="/drawing" class="app-card">
        <div class="app-icon">🎨</div>
        <h2>그림판</h2>
        <p>자유롭게 그림을 그려보세요!</p>
        </NuxtLink>
    </div>
    <div class="kawaii-footer">
        ₍ᐢ. ̫ .ᐢ₎♡
    </div>
    </div>
</div>
</template>

<style scoped>
.welcome-page {
min-height: 100vh;
display: flex;
align-items: center;
justify-content: center;
padding: 20px;
}

.welcome-content {
max-width: 800px;
width: 90%;
text-align: center;
}

h1 {
font-size: 32px;
color: #2E7D32;
margin-bottom: 40px;
}

.app-cards {
display: flex;
gap: 30px;
justify-content: center;
flex-wrap: wrap;
}

.app-card {
background: #E8F5E9;
border: 4px solid #81C784;
border-radius: 20px;
padding: 25px;
width: 200px;
text-decoration: none;
transition: all 0.3s ease;
}

.app-card:hover {
transform: translateY(-10px);
box-shadow: 0 10px 20px rgba(46, 125, 50, 0.2);
background: #C8E6C9;
}

.app-icon {
font-size: 48px;
margin-bottom: 15px;
}

h2 {
color: #2E7D32;
margin: 0 0 10px 0;
}

p {
color: #2E7D32;
margin: 0;
font-size: 14px;
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
margin-top: 40px;
color: #2E7D32;
font-size: 20px;
}
</style>