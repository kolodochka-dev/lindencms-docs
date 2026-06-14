import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// Импортируем страницы
import HomePage from './pages/HomePage.vue'
import GettingStarted from './pages/GettingStarted.vue'
// import Core from './pages/Core.vue'
// import Templator from './pages/Templator.vue'
// import Cms from './pages/Cms.vue'

const routes = [
    { path: '/', component: HomePage },
    { path: '/getting-started', component: GettingStarted },
    // { path: '/core', component: Core },
    // { path: '/templator', component: Templator },
    // { path: '/cms', component: Cms }
]

const router = createRouter({
    history: createWebHistory('/'),
    routes
})

createApp(App).use(router).mount('#app')