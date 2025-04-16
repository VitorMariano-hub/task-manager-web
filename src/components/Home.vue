<template>
  <div class="p-6 bg-gradient-to-br from-slate-800 via-slate-600 to-slate-700 min-h-screen">
    <div class="flex gap-6 overflow-x-auto pb-4">
      <div
        v-for="(group, status) in groupedTasks"
        :key="status"
        class="flex-shrink-0 w-80 bg-white rounded-xl shadow-lg p-4 space-y-4 border border-gray-200"
        :style="{ minHeight: 'calc(100vh - 50px)', maxHeight: 'calc(100vh - 50px)' }" 
        :data-status="status"
        @dragover.prevent="handleDragOver"
        @drop="handleDrop"
      >
        <!-- Título da coluna -->
        <h2 class="text-lg font-bold text-gray-700 tracking-wide flex items-center justify-between">
          {{ getStatusLabel(status) }}
          <!-- Badge opcional com quantidade -->
          <span class="bg-slate-200 text-slate-800 text-xs px-2 py-0.5 rounded-full">
            {{ group.length }}
          </span>
        </h2>
        <!-- Botão de adicionar -->
        <button
          v-if="status === 'pending'"
          @click="openModal"
          class="mt-2 w-full py-2 text-sm bg-teal-500 hover:bg-teal-700 text-white rounded-lg transition"
        >
          + Nova Tarefa
        </button>
        <!-- Lista de tarefas -->
        <div class="flex-1 overflow-y-auto custom-scrollbar p-2" :style="{ maxHeight: 'calc(100vh - 200px)' }">
          <draggable
            :list="group"
            :group="{ name: 'tasks' }"
            item-key="id"
            class="space-y-4"
          >
            <template #item="{ element }">
              <div :data-id="element.id">
                <TaskItem
                  :task="element"
                  @delete="deleteTask"
                  @dragstart="(e) => onDragStart(e, element.id)"
                />
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>

    <!-- Modal de criação de tarefa -->
    <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center">
      <!-- Modal com borda suave e sombra -->
      <div class="bg-slate-700 p-6 rounded-2xl shadow-md w-96 ">
        <h2 class="text-lg font-bold text-white mb-4">Nova Tarefa</h2>
        <form @submit.prevent="createTask">
          <div class="mb-4">
            <label for="taskName" class="block text-sm font-semibold text-white">Titulo da Tarefa</label>
            <input
              type="text"
              id="taskName"
              v-model="newTask.title"
              class="mt-1 p-2 w-full text-slate-300 border border-white rounded-lg"
              required
            />
          </div>
          <div class="mb-4">
            <label for="taskDescription" class="block text-sm font-semibold text-white">Descrição</label>
            <textarea
              id="taskDescription"
              v-model="newTask.description"
              class="mt-1 p-2 w-full border border-white rounded-lg text-slate-300"
              rows="4"
            ></textarea>
          </div>
          <div class="flex justify-between">
            <button
              type="button"
              @click="closeModal"
              class="text-sm bg-slate-600 hover:bg-slate-700 py-2 px-4 rounded-lg text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="py-2 px-4 bg-teal-500 hover:bg-teal-700 text-white rounded-lg transition"
            >
              Criar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px; 
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(155, 155, 155, 0.5);
    border-radius: 10px;
    border: 2px solid rgba(252, 252, 252, 0.774); 
    transition: background-color 0.3s ease; 
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(100, 100, 100, 0.8); 
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
</style>

<script setup>
import { ref, computed } from 'vue'
import draggable from 'vuedraggable'
import TaskItem from '../components/TaskItem.vue'
import { getTasks, updateTask, createTask as apiCreate, deleteTask as apiDelete } from '../services/api'

const tasks = ref([])
const isModalOpen = ref(false)
const newTask = ref({
  title: '',
  description: ''
})

const fetchTasks = async () => {
  try {
    tasks.value = await getTasks()
  } catch (error) {
    console.error('Erro ao carregar tasks', error)
  }
}

const statuses = [
  { key: 'pending', label: 'Pending' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' }
]

const groupedTasks = computed(() => {
  return statuses.reduce((acc, { key }) => {
    acc[key] = tasks.value.filter(t => t.status === key)
    return acc
  }, {})
})

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  newTask.value = { title: '', description: '' }
}

const createTask = async () => {
  if (newTask.value.title.trim() === '') return

  try {
    await apiCreate(newTask.value)
    await fetchTasks()
    closeModal()
  } catch (error) {
    console.error('Erro ao criar tarefa', error)
  }
}


const onDragStart = (event, id) => {
  event.dataTransfer.setData("task-id", id)
}

const onDragEnd = async (event) => {
  const id = parseInt(event.item?.dataset?.id)

  if (!id) return

  const task = tasks.value.find(t => t.id === id)
  const toColumn = event.to?.closest('[data-status]')

  if (!task || !toColumn) return

  const newStatus = toColumn.dataset.status

  if (newStatus && task.status !== newStatus) {
    task.status = newStatus
    await updateTask(task.id, task)

    tasks.value = tasks.value.map(t =>
      t.id === task.id ? { ...t, status: newStatus } : t
    )
  }
}

const handleDragOver = (event) => {
  event.preventDefault();
}

const handleDrop = (event) => {
  event.preventDefault();

  const newStatus = event.currentTarget.dataset.status;
  const id = event.dataTransfer.getData("task-id");
  const task = tasks.value.find(t => t.id === parseInt(id));

  if (task && newStatus && task.status !== newStatus) {
    task.status = newStatus;

    updateTask(task.id, task);

    tasks.value = tasks.value.map(t =>
      t.id === task.id ? { ...t, status: newStatus } : t
    );
  }
}

const deleteTask = async (id) => {
  await apiDelete(id)
  tasks.value = tasks.value.filter(t => t.id !== id)
}

const getStatusLabel = (status) => {
  const found = statuses.find(s => s.key === status)
  return found ? found.label : status
}

fetchTasks()
</script>
