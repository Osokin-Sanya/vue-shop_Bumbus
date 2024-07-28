<template>
  <section class="mb-6">
    <h2 class="text-2xl font-semibold text-gray-900 mb-4">Адреса</h2>

    <div>
      <div class="flex justify-between items-center border-b pb-2">
        <div class="text-lg text-gray-700">
          {{ address.city }}{{ address.city && ',' }} {{ address.region }}
        </div>
        <button @click="editAddress" class="text-blue-600 hover:underline">Змінити</button>
      </div>
      <div
        v-if="!fieldsAddress"
        class="p-2 mb-4 text-red-700 bg-red-100 border border-red-400 rounded-lg flex justify-between items-center"
        :class="{ hidden: editMode }"
      >
        Заповніть адресу
      </div>
      <div v-if="isEditingAddress" class="flex flex-col gap-4 mt-4">
        <input
          @input="debouncedSearchOnCity"
          @click="debouncedSearchOnCity"
          v-model="address.city"
          type="text"
          placeholder="Місто"
          class="p-2 border rounded"
        />
        <ul v-show="cities.length" class="border p-2 mt-12 rounded shadow absolute bg-white">
          <li
            v-for="city in cities"
            :key="city"
            @click="selectCity(city)"
            class="cursor-pointer p-1 hover:bg-gray-200"
          >
            {{ city.Description }} - {{ city.AreaDescription }} Область
          </li>
        </ul>

        <button
          @click="saveAddress"
          class="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          Зберегти
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, watch, watchEffect } from 'vue'
import { ref } from 'vue'
import { useStore } from 'vuex'
import { debounce } from 'lodash'
import { searchCities } from '@/utils/searchOnCity'
import { address, delivery } from '@/utils/data'

defineProps({
  fieldsAddress: Boolean
})

const store = useStore()
const editMode = computed(() => store.getters['order/getOrderMode'])
const order = computed(() => store.getters['order/getOrder'])

const emit = defineEmits(['update:fieldsAddress'])

const isEditingAddress = ref(false)
const cities = ref([])

watchEffect(() => {
  if (order.value && editMode.value) {
    address.value.city = order.value?.address?.address.city
    address.value.region = order.value?.address?.address.region
  } else {
    address.value.city = ''
    address.value.region = ''
  }
})
watchEffect(() => {
  if (order.value && editMode.value) {
    store.dispatch('order/setAddress', {
      city: order.value?.address?.address.city,
      region: order.value?.address?.address.region
    })
  }
})

watch(address.value, () => {
  ;(delivery.value.selfPickupNovaPoshta = ''),
    (delivery.value.selfPickupPostomat = ''),
    (delivery.value.courierAddress = {})
})

const editAddress = () => {
  isEditingAddress.value = !isEditingAddress.value
}

const saveAddress = () => {
  isEditingAddress.value = false
}

const searchCity = async (event) => {
  searchCities(event.target.value).then((data) => {
    cities.value = data
  })
}

const debouncedSearchOnCity = debounce(searchCity, 500)
const selectCity = (city) => {
  address.value.city = city.Description
  address.value.region = city.AreaDescription + ' Область'
  cities.value = []

  store.dispatch('order/setAddress', address.value)
  store.dispatch('order/setCityRef', city.Ref)

  emit('update:fieldsAddress', true)
}
</script>
