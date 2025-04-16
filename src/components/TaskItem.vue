<template>
  <div
    class="bg-white m-2 p-4 rounded-xl shadow space-y-3 border border-gray-200 hover:shadow-lg transition duration-200"
    :class="status === 'completed' ? 'cursor-default' : 'cursor-grab'"
    :draggable="status !== 'completed'"
    @dragstart="$emit('dragstart', $event, task.id)"
  >
    <!-- Título da tarefa -->
    <p class="font-semibold text-gray-800 text-sm truncate">
      {{ task.title }}
    </p>

    <!-- Descrição -->
    <p class="text-gray-600 text-xs leading-snug">
      {{ task.description }}
    </p>

    <!-- Infos adicionais -->
    <div class="text-[11px] space-y-1">
      <div class="flex items-center gap-1 text-gray-400">
        📅 <span>Criada em {{ formatDate(task.created_at) }}</span>
      </div>

      <!-- Exibe tempo restante ou concluído -->
      <div v-if="status === 'completed'" class="flex items-center gap-1 text-green-700 italic">
        ✅ <span>Concluída</span>
      </div>
      <div v-else class="flex items-center gap-1 text-red-500 italic">
        ⏳ <span>Tempo restante: {{ formatTime(task.time_left) }}</span>
      </div>
    </div>

    <!-- Rodapé -->
    <div class="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-100">
      <button
        v-if="status !== 'completed'"
        class="text-red-500 hover:text-red-600"
        @click="$emit('delete', task)"
        title="Excluir tarefa"
      >
        🗑️
      </button>
      <span
        class="bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs"
      >
        {{ getInitials(task.user?.name || task.title) }}
      </span>
    </div>
  </div>
</template>


<script setup>
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

defineProps(['task', 'status'])
defineEmits(['delete', 'dragstart'])

const handleDelete = () => {
  emit('delete', task)
}
const getInitials = (name) => {
  return name
    ? name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
    : '?'
}

const formatDate = (date) => {
  if (!date) return ''
  // Convertendo a data ISO para o formato correto de fuso horário local
  const parsedDate = parseISO(date)
  return format(parsedDate, "dd/MM/yyyy", { locale: ptBR })
}

const formatTime = (timeInSeconds) => {
  const hours = Math.floor(timeInSeconds / 3600)
  const minutes = Math.floor((timeInSeconds % 3600) / 60)

  return `${hours}h ${minutes.toString().padStart(2, '0')}m`
}
</script>
