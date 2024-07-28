<template>
  <div v-show="!popupSuccessfulOrder">
    <OrderDetails :order="fullOrder" @close="emit('close')" />
    <DeliveryCost :cost="deliveryCost" />
    <OrderTotal :total="totalCost" @submit="submit" />
  </div>

  <OrderSuccess v-show="popupSuccessfulOrder" />
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue'
import { useStore } from 'vuex'

import OrderDetails from './SuccessfulOrderSection/OrderDetails.vue'
import DeliveryCost from './SuccessfulOrderSection/DeliveryCost.vue'
import OrderTotal from './SuccessfulOrderSection/OrderTotal.vue'
import OrderSuccess from './SuccessfulOrderSection/OrderSuccess.vue'
import { calculateTotalPrice } from '@/utils/utils'
import { address, contact, delivery } from '@/utils/data'

const emit = defineEmits(['close'])

const store = useStore()
const allData = computed(() => store.getters['order/getAllData'])
const editMode = computed(() => store.getters['order/getOrderMode'])
const popupSuccessfulOrder = ref(false)

const fullOrder = ref({})

const totalCost = computed(
  () => calculateTotalPrice(fullOrder.value.basket, true) + deliveryCost.value
)
const deliveryCost = computed(() => fullOrder.value.deliveryCost || 0)

watchEffect(() => {
  fullOrder.value = {
    address: allData.value.address,
    basket: allData.value.basket,
    contact: allData.value.contact,
    delivery: allData.value.delivery,
    cityRef: allData.value.cityRef,
    deliveryCost: allData.value.deliveryCost
  }
})

const clearOrderFields = () => {
  delivery.value = {
    method: 'Виберіть спосіб доставки',
    selfPickupNovaPoshta: '',
    selfPickupPostomat: '',
    courierAddress: { street: '', house: '', apartment: '', cargoElevator: '', floor: '' },
    deliveryCost: 0,
    comment: ''
  }
  contact.value = { firstName: '', lastName: '', phone: '', email: '' }
  address.value = { city: '', region: '' }
}

const submit = async () => {
  try {
    const action = editMode.value ? 'updatedMyOrder' : 'postOrder'
    const data = await store.dispatch(`order/${action}`, fullOrder.value)
    if (data) {
      popupSuccessfulOrder.value = true
      if (!editMode.value) {
        clearOrderFields()
        await store.dispatch('basket/removeToBasketAll')
      }
    }
  } catch (error) {
    console.error('Error processing order:', error)
  }
}
</script>
