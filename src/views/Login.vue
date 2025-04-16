<template>
  <div class="p-6 bg-gradient-to-br from-slate-800 via-slate-600 to-slate-700 min-h-screen flex justify-center items-center">
    <div class="bg-white p-8 rounded-lg shadow-lg w-96">
      <h2 class="text-2xl font-bold text-center text-slate-800 mb-6">Login</h2>
      <form @submit.prevent="handleLogin">
        <!-- Input de email -->
        <div class="mb-4">
          <label for="email" class="block text-sm font-semibold">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            placeholder="Digite seu email"
            required
          />
        </div>
        <!-- Input de senha -->
        <div class="mb-4">
          <label for="password" class="block text-sm font-semibold">Senha</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            placeholder="Digite sua senha"
            required
          />
        </div>
        <!-- Botão de login -->
        <div class="flex justify-center">
          <button
            type="submit"
            class="py-2 px-4 bg-teal-500 hover:bg-teal-700 text-white rounded-lg w-full"
          >
            Entrar
          </button>
        </div>
      </form>
      <!-- Link para cadastro (opcional) -->
      <div class="mt-4 text-center">
        <p class="text-sm text-gray-600">Não tem uma conta? <router-link to="/register" class="text-indigo-600 hover:text-indigo-700">Cadastre-se</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../services/api'

const email = ref('')
const password = ref('')
const router = useRouter()

const handleLogin = async () => {
  try {
    const data = await login({ email: email.value, password: password.value })
    localStorage.setItem('auth', data.token)
    router.push('/app')
  } catch (error) {
    alert('Login inválido!')
    console.error(error)
  }
}
</script>
