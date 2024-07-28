<template>
  <div class="p-4">
    <div v-for="option in options" :key="option.value" class="mb-2">
      <input
        type="radio"
        :id="option.value"
        :value="option.value"
        :checked="option.value === selectedOption"
        @click="$emit('select', option.value, option.label, option.price)"
        class="mr-2"
      />
      <label :for="option.value" class="mr-2">{{ option.label }}</label>
      <span class="text-gray-500">{{ option.price }} ₴</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  options: Array,
  selectedOption: String
})
defineEmits(['select'])
</script>
