<template>
  <section class="mb-6">
    <h2 class="text-2xl font-semibold text-gray-900 mb-4">Отримувач</h2>
    <div class="p-4 border rounded-lg shadow-sm bg-gray-50">
      <div class="flex justify-between items-center">
        <div class="text-lg text-gray-700">
          {{ `${contact.firstName} ${contact.lastName}` }}
        </div>
      </div>

      <div class="text-sm text-gray-500 mt-4">
        Зверніть увагу, отримання замовлення за паспортом. Введіть прізвище, ім'я, по батькові як
        зазначено у документі та мобільний номер телефону отримувача замовлення
      </div>
    </div>
  </section>
</template>

<script setup>
import { contact } from '@/utils/data'
</script>
