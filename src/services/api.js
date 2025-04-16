import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para adicionar o token dinamicamente
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api

export const login = async (credentials) => {
  const response = await api.post('/login', credentials)
  return response.data
}

export const getTasks = async () => {
  const response = await api.get('/tasks')
  return response.data
}

export const createTask = async (task) => {
  const response = await api.post('/tasks', task)
  return response.data
}

export const updateTask = async (taskId, task) => {
  const response = await api.put(`/tasks/${taskId}`, task)
  return response.data
}

export const deleteTask = async (taskId) => {
  const response = await api.delete(`/tasks/${taskId}`)
  return response.data
}
