<template>
    <Home />
</template>

<script setup>
import { useRouter } from 'vue-router'
import Home from '../components/Home.vue'

const router = useRouter()

const logout = () => {
  localStorage.removeItem('auth')
  router.push('/login')
}
</script>
