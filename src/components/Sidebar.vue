<!-- src/components/Sidebar.vue -->
<template>
  <aside class="w-64 bg-slate-900 text-white h-screen fixed top-0 left-0 flex flex-col shadow-lg">
      <div class="p-4 border-b border-slate-700 flex gap-2">
  <img src="/taskmanager.png" class="w-8 h-8" alt="Logo Task Manager">
  <span class="text-md font-bold self-end">Daily Task Manager</span>
</div>

    <nav class="flex-1 p-4 space-y-4 ">
      <button
        class="w-full text-left px-4 py-2 rounded transition"
        :class="isActive('/app') ? 'bg-slate-700' : 'hover:bg-slate-600'"
        @click="goTo('/app')"
      >
        Tarefas
      </button>
    </nav>

    <div class="p-4 border-t border-slate-700">
      <button
        @click="logout"
        :disabled="isLoggingOut"
        class="w-full text-left px-4 py-2 bg-slate-800 hover:bg-slate-600 rounded text-white transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          v-if="isLoggingOut"
          class="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
          ></path>
        </svg>
        <span>{{ isLoggingOut ? 'Saindo...' : 'Sair' }}</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'

const isLoggingOut = ref(false)
const router = useRouter()
const route = useRoute()

const logout = () => {
  isLoggingOut.value = true

  setTimeout(() => {
    localStorage.removeItem('auth')
    router.push('/login')
    isLoggingOut.value = false
  }, 500)
}

const goTo = (path) => {
  router.push(path)
}

const isActive = (path) => {
  return route.path === path
}
</script>
