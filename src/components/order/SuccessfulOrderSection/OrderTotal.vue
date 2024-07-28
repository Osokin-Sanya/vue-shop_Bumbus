<template>
  <div class="flex justify-between items-center mt-4">
    <p class="text-lg font-bold text-gray-900 mr-auto">Загальна вартість: {{ total }} ₴</p>
    <button
      @click="$emit('submit')"
      class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
    >
      Замовлення підтверджую
    </button>
  </div>
</template>

<script setup>
defineProps(['total'])
</script>
