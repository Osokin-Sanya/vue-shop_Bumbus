<template>
  <section class="mb-6">
    <div class="flex items-center">
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">Ваші контактні дані</h2>
      <p class="text-red-400 text-2xl ml-2 font-semibold mb-4">*</p>
    </div>
    <div>
      <div class="flex justify-between border-b pb-2 flex-col">
        <div class="text-lg text-gray-700">{{ contact.lastName }} {{ contact.firstName }}</div>
        <div class="text-lg text-gray-700">Номер телефону: {{ contact.phone }}</div>
        <div class="text-lg text-gray-700">Пошта: {{ contact.email }}</div>
        <button @click="editContact" class="text-blue-600 hover:underline ml-auto">Змінити</button>
      </div>

      <form @submit.prevent="saveContact">
        <div v-if="isEditingContact" class="flex flex-col gap-4 mt-4">
          <input
            v-model="contact.firstName"
            type="text"
            placeholder="Ім'я"
            class="p-2 border rounded"
            required
          />
          <input
            v-model="contact.lastName"
            type="text"
            placeholder="Прізвище"
            class="p-2 border rounded"
            required
          />
          <input
            v-model="contact.phone"
            type="tel"
            placeholder="Мобільний телефон"
            pattern="[+]{0,1}[0-9]{10,14}"
            class="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            v-model="contact.email"
            type="text"
            placeholder="Електронна пошта"
            class="p-2 border rounded"
          />
          <button
            type="submit"
            class="py-2 px-4 bg-green-600 font-bold text-white rounded-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            {{ editMode ? 'Пiдтвердіть актуальність полiв' : 'Зберегти' }}
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { contact } from '@/utils/data'

defineProps({
  fieldsContact: Boolean
})
const store = useStore()
const user = computed(() => store.getters['authorization/getUser'])
const order = computed(() => store.getters['order/getOrder'])
const editMode = computed(() => store.getters['order/getOrderMode'])
const isEditingContact = ref(true)
const emit = defineEmits(['update:fieldsContact'])

watchEffect(() => {
  if (editMode.value) {
    ;(contact.value.firstName = order.value.contact?.firstName || ''),
      (contact.value.lastName = order.value.contact?.lastName || ''),
      (contact.value.phone = order.value.contact?.phone || ''),
      (contact.value.email = order.value.contact?.email || '')
  } else {
    ;(contact.value.firstName = user.value.user_metadata.name || ''),
      (contact.value.lastName = ''),
      (contact.value.phone = ''),
      (contact.value.email = user.value.user_metadata.email || '')
  }
})

const editContact = () => {
  isEditingContact.value = !isEditingContact.value
}

const saveContact = () => {
  store.dispatch('order/setContact', contact)
  isEditingContact.value = false
  emit('update:fieldsContact', true)
}
</script>
