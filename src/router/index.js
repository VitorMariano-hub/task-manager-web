import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/app',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Middleware de proteção de rota
router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('auth')
  
    if (to.meta.requiresAuth && !isAuthenticated) {
      next('/login')
    } 
    else if (to.meta.requiresGuest && isAuthenticated) {
      next('/app')
    } else {
      next()
    }
  })
  
export default router
