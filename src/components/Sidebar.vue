<!-- src/components/Sidebar.vue -->
<template>
  <aside class="w-64 bg-slate-900 text-white h-screen fixed top-0 left-0 flex flex-col shadow-lg">
    <div class="p-6 font-bold text-2xl border-b border-slate-700">
      Task Manager
    </div>

    <nav class="flex-1 p-4 space-y-4">
      <button
        class="w-full text-left px-4 py-2 rounded transition"
        :class="isActive('/app') ? 'bg-slate-700' : 'hover:bg-slate-700'"
        @click="goTo('/app')"
      >
        Home
      </button>
    </nav>

    <div class="p-4 border-t border-slate-700">
      <button
        @click="logout"
        class="w-full text-left px-4 py-2 bg-red-500 hover:bg-red-600 rounded text-white transition"
      >
        Logout
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const logout = () => {
  localStorage.removeItem('auth')
  router.push('/login')
}

const goTo = (path) => {
  router.push(path)
}

const isActive = (path) => {
  return route.path === path
}
</script>
