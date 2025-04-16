<template>
  <div class="flex">
    <Sidebar />
    <div class="ml-64 w-full">
      <Home />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Home from '../components/Home.vue'
import Sidebar from '../components/Sidebar.vue'


const router = useRouter()

const logout = () => {
  localStorage.removeItem('auth')
  router.push('/login')
}
</script>
