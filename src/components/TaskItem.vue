<template>
  <div
    class="bg-white p-3 rounded shadow space-y-2 cursor-grab border border-gray-200 hover:shadow-lg transition duration-200"
    draggable="true"
    @dragstart="$emit('dragstart', $event, task.id)"
  >
    <!-- Título da tarefa -->
    <p class="font-semibold text-gray-800 text-sm">
      {{ task.title }}
    </p>

    <!-- Descrição -->
    <p class="text-gray-600 text-xs leading-snug">
      {{ task.description }}
    </p>

    <!-- Rodapé: botão de deletar e badge -->
    <div class="flex justify-between items-center text-xs text-gray-500 mt-2">
      <!-- Botão deletar -->
      <button
        class="text-red-500 hover:text-red-600"
        @click="$emit('delete', task.id)"
        title="Excluir tarefa"
      >
        🗑️
      </button>

      <!-- Badge com inicial (mockada com nome do responsável, se tiver) -->
      <span
        class="bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs"
      >
        {{ getInitials(task.assigned_to || task.title) }}
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps(['task'])
defineEmits(['delete', 'dragstart'])

const getInitials = (name) => {
  return name
    ? name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
    : '?'
}
</script>
