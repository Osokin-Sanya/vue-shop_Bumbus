<template>
  <section class="mb-6">
    <div class="flex items-center">
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">Доставка</h2>
      <p class="text-red-400 text-2xl ml-2 font-semibold mb-4">*</p>
    </div>

    <DeliveryInfo :delivery="delivery" @edit="editDelivery" />

    <DeliveryOptions
      v-if="isEditingDelivery"
      :options="deliveryOptions"
      :selectedOption="selectedOption"
      @select="changesSelectedOptionsDelivery"
    />
    <component
      :is="deliveryComponentMap[selectedOption]"
      v-if="isEditingDelivery && selectedOption"
      v-bind="deliveryComponentProps"
    />
    <div>
      <label for="comment" class="block text-sm font-medium text-gray-700">Коментар</label>
      <textarea
        id="comment"
        :disabled="!getCityRef"
        v-model="delivery.comment"
        class="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      ></textarea>
    </div>

    <div v-if="editMode && confirmFields" class="mt-4">
      <button
        @click="confirm"
        class="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Пiдтвердити актуальність полiв
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, ref, watch, watchEffect } from 'vue'
import { useStore } from 'vuex'
import DeliveryInfo from './deliverySection/DeliveryInfo.vue'
import DeliveryOptions from './deliverySection/DeliveryOptions.vue'
import NovaPoshtaPickup from './deliverySection/NovaPoshtaPickup.vue'
import PostomatPickup from './deliverySection/PostomatPickup.vue'
import CourierDelivery from './deliverySection/CourierDelivery.vue'
import { useDelivery } from '@/utils/useDelivery'
import { useStreetSearch } from '@/utils/useStreetSearch'
import { delivery } from '@/utils/data'

defineProps({
  fieldsDelivery: Boolean,
  fieldsAddress: Boolean
})

const emit = defineEmits(['update:fieldsDelivery', 'update:fieldsAddress'])
const confirmFields = ref(true)
const ignoreWatch = ref(false)

const store = useStore()
const editMode = computed(() => store.getters['order/getOrderMode'])
const getCityRef = computed(() => store.getters['order/getCityRef'])
const {
  selectedOption,
  isEditingDelivery,
  deliveryOptions,
  changesSelectedOptionsDelivery,
  selectDepartment,
  searchDepartment,
  searchDepartmentPostomat,
  novaPoshtaDepartments
} = useDelivery(store)

const { searchStreets, streets, selectStreet } = useStreetSearch(store)

const deliveryComponentMap = {
  selfPickupNovaPoshta: NovaPoshtaPickup,
  selfPickupPostomat: PostomatPickup,
  courier: CourierDelivery
}

const deliveryComponentProps = computed(() => ({
  delivery: delivery.value,
  cityRef: getCityRef.value,
  onSave: saveChanges,
  ...(selectedOption.value === 'selfPickupNovaPoshta' && {
    searchDepartment,
    novaPoshtaDepartments: novaPoshtaDepartments.value,
    selectDepartment
  }),
  ...(selectedOption.value === 'selfPickupPostomat' && {
    searchDepartmentPostomat,
    novaPoshtaDepartments: novaPoshtaDepartments.value,
    selectDepartment
  }),
  ...(selectedOption.value === 'courier' && {
    searchStreets,
    streets: streets.value,
    selectStreet
  })
}))

watchEffect(() => {
  const conditions = {
    selfPickupNovaPoshta: delivery.value.selfPickupNovaPoshta.length > 0,
    selfPickupPostomat: delivery.value.selfPickupPostomat.length > 0,
    courier: true
  }
  const valid = conditions[selectedOption.value] || false
  emit('update:fieldsDelivery', valid)
})

const editDelivery = () => {
  isEditingDelivery.value = !isEditingDelivery.value
}

const confirm = () => {
  emit('update:fieldsDelivery', true)
  emit('update:fieldsAddress', true)
  store.dispatch('order/setDelivery', delivery.value)
  confirmFields.value = false
}

const saveChanges = () => {
  ignoreWatch.value = true
  store.dispatch('order/setDelivery', delivery.value)
  isEditingDelivery.value = false
  emit('update:fieldsDelivery', true)

  nextTick(() => {
    ignoreWatch.value = false
  })
}

watch(
  [
    () => delivery.value.selfPickupNovaPoshta,
    () => delivery.value.selfPickupPostomat,
    () => delivery.value.courierAddress
  ],
  () => {
    if (!ignoreWatch.value) {
      emit('update:fieldsDelivery', false)
    }
  },
  { deep: true }
)

document.addEventListener('click', () => {
  if (novaPoshtaDepartments.value.length > 0) {
    novaPoshtaDepartments.value = []
  } else if (streets.value.length > 0) {
    streets.value = []
  }
})
</script>
