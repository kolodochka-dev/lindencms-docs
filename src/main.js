import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// Импортируем страницы
import HomePage from './pages/HomePage.vue'

const routes = [
    { path: '/', component: HomePage },
]

const router = createRouter({
    history: createWebHistory('/lindencms/'),
    routes
})

createApp(App).use(router).mount('#app')