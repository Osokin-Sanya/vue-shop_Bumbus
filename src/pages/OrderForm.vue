<template>
  <div v-if="user" @click="closeMenu" class="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg">
    <h1 class="text-3xl font-bold mb-6 text-gray-900">Оформлення замовлення</h1>

    <ContactInfoSection
      :fieldsContact="fieldsContact"
      @update:fieldsContact="updateFieldsContact"
    />
    <OrderSummary />
    <AddressSection :fieldsAddress="fieldsAddress" @update:fieldsAddress="updateFieldsAddress" />
    <DeliverySection
      :fieldsDelivery="fieldsDelivery"
      :fieldsAddress="fieldsAddress"
      @update:fieldsDelivery="updateFieldsDelivery"
      @update:fieldsAddress="updateFieldsAddress"
    />
    <RecipientInfo />

    <OrderTotal :fieldsFilled="fieldsFilled" @open-popup="openPopupConfirmationOrder" />
    <div
      class="fixed top-0 left-0 w-full bg-opacity-50 bg-gray-900 h-full flex items-center justify-center"
      v-show="popupConfirmationOrder"
    >
      <div class="p-6 -mt-32 bg-white shadow-md rounded-lg">
        <SuccessfulOrder @close="closePopupConfirmationOrder" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import ContactInfoSection from '@/components/order/ContactInfoSection.vue'
import AddressSection from '@/components/order/AddressSection.vue'
import OrderSummary from '@/components/order/OrderSummaryItems.vue'
import DeliverySection from '@/components/order/DeliverySection.vue'
import RecipientInfo from '@/components/order/RecipientInfo.vue'
import OrderTotal from '@/components/order/OrderTotal.vue'
import SuccessfulOrder from '@/components/order/SuccessfulOrder.vue'

const store = useStore()
const router = useRouter()

const editMode = computed(() => store.getters['order/getOrderMode'])
const user = computed(() => store.getters['authorization/getUser'])
const getBasketIds = computed(() => store.getters['basket/getBasketIds'])

const popupConfirmationOrder = ref(false)

const fieldsFilled = ref(false)
const fieldsContact = ref(false)
const fieldsAddress = ref(false)
const fieldsDelivery = ref(false)

watchEffect(() => {
  fieldsFilled.value = fieldsContact.value && fieldsAddress.value && fieldsDelivery.value
})

watchEffect(() => {
  if (
    !editMode.value &&
    (router.currentRoute.value.fullPath === '/edit-order' ||
      router.currentRoute.value.fullPath === '/edit-order/')
  ) {
    router.push({ name: 'home' })
  }
})

watchEffect(() => {
  if (!user.value || Object.keys(user.value).length === 0) {
    router.push({ name: 'home' })
  }
})

watch(getBasketIds, (newIds) => {
  if (!editMode.value && newIds.length === 0) {
    router.push({ name: 'home' })
  } else {
    store.dispatch('basket/fetchBasketItems')
  }
})

const updateFieldsContact = (value) => {
  fieldsContact.value = value
}
const updateFieldsAddress = (value) => {
  fieldsAddress.value = value
}
const updateFieldsDelivery = (value) => {
  fieldsDelivery.value = value
}

const closePopupConfirmationOrder = () => {
  popupConfirmationOrder.value = false
}
const openPopupConfirmationOrder = () => {
  popupConfirmationOrder.value = true
}

const initializeData = async () => {
  store.dispatch('basket/fetchBasketItems')
  if (!editMode.value && (await getBasketIds.value.length) === 0) {
    router.push({ name: 'home' })
  }
}
onMounted(async () => {
  if (!user.value || Object.keys(user.value).length === 0) {
    router.push({ name: 'home' })
  } else {
    await initializeData()
  }
})
</script>
