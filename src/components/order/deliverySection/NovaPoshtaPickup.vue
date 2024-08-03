<template>
  <div class="mt-4">
    <div class="block text-sm font-medium text-gray-700">Виберіть відповідне відділення</div>
    <input
      :disabled="!cityRef"
      @input="searchDepartment($event)"
      @click="searchDepartment($event)"
      v-model="delivery.selfPickupNovaPoshta"
      type="text"
      placeholder="Введіть номер або адресу відділення"
      class="p-2 border rounded w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
    />
    <div v-show="!cityRef" class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
      <p>Спочатку виберіть місто</p>
    </div>
    <ul
      v-show="novaPoshtaDepartments?.length"
      class="border p-2 mt-1 rounded shadow absolute bg-white"
    >
      <li
        v-for="department in novaPoshtaDepartments"
        :key="department.SiteKey"
        @click="select(department, props.delivery)"
        class="cursor-pointer p-1 hover:bg-gray-200"
      >
        {{ department.Description }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { delivery } from '@/utils/data'
import { defineProps } from 'vue'
const props = defineProps({
  cityRef: String,
  searchDepartment: Function,
  onSave: Function,
  novaPoshtaDepartments: Array,
  changesDelivery: Function,
  selectDepartment: Function
})

const select = (department) => {
  props.selectDepartment(department)
  props.onSave()
}
</script>
