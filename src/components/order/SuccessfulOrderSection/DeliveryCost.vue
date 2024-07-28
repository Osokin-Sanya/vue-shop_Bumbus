<template>
  <div class="text-gray-700 font-semibold mt-4">Вартість доставки: {{ cost }} ₴</div>
</template>

<script setup>
defineProps(['cost'])
</script>
