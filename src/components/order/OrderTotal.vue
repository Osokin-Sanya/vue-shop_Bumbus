<template>
  <div class="flex justify-between items-center p-4 border rounded-lg shadow-sm bg-gray-50">
    <div>
      <div class="text-lg text-gray-700">Разом</div>
      <div class="text-xl font-bold text-gray-900">{{ totalCost }} ₴</div>

      <div class="text-sm text-gray-500">Вартість доставки {{ deliveryCost }} ₴</div>
    </div>

    <button
      @click="submitOrder"
      class="py-2 pointer px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 '"
    >
      Замовлення підтверджую
    </button>
  </div>
</template>

<script setup>
import { calculateTotalPrice } from '@/utils/utils'
import { computed, ref, watchEffect } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  fieldsFilled: Boolean,
  openPopup: Function,
  checkFieldsAndScroll: Function
})

const emit = defineEmits(['open-popup'])

const store = useStore()

const itemsBasket = computed(() => store.getters['order/getBasket'])
const getDeliveryCost = computed(() => store.getters['order/getDeliveryCost'])

const totalCost = ref(0)
const deliveryCost = ref(0)
watchEffect(() => {
  deliveryCost.value = getDeliveryCost.value
})
watchEffect(() => {
  totalCost.value = calculateTotalPrice(itemsBasket.value, true) + deliveryCost.value
})

const submitOrder = () => {
  props.checkFieldsAndScroll()
  if (props.fieldsFilled) {
    emit('open-popup')
  }
}
</script>
