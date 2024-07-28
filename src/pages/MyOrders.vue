<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Мої замовлення</h1>
    <div v-if="orders.length === 0" class="text-center text-gray-500">У вас немає замовлень.</div>
    <div v-else class="space-y-4">
      <div v-for="order in orders" :key="order.id" class="border p-4 rounded-lg shadow-sm">
        <div class="flex justify-between items-center mb-2">
          <div>
            <p class="text-lg font-semibold">Замовлення №{{ order.id }}</p>
            <p class="text-sm text-gray-600">Дата: {{ order.created_at.slice(0, 10) }}</p>
          </div>
          <div class="flex items-end gap-2">
            <p class="text-lg font-semibold">Статус:</p>
            <p
              :class="{
                'text-sl font-semibold border px-2 text-gray-600': true,
                'bg-gray-100': order.status === 1,
                'bg-green-100': order.status === 2,
                'bg-red-100': order.status === 3
              }"
            >
              {{ updateStatus(order.status) }}
            </p>
          </div>
        </div>
        <div class="space-y-2">
          <div
            v-for="item in order.products"
            :key="item.id"
            class="flex justify-between items-center"
          >
            <div class="flex items-center space-x-4">
              <img
                class="w-20 h-20 object-cover rounded-lg shadow-md"
                :src="item.imageUrl"
                alt=""
              />
              <div>
                <p class="text-lg">{{ item.title }}</p>
                <p class="text-sm text-gray-500">{{ item.price }} ₴</p>
              </div>
            </div>
            <div class="text-lg font-bold text-gray-900">
              {{ item.price * item.amount }} ₴ х {{ item.amount }} од.
            </div>
          </div>
          <div class="flex justify-between">
            <button
              v-if="order.status !== 3"
              @click="link(order.id)"
              class="text-lg font-bold text-gray-600 bg-blue-100 px-2 py-1 hover:bg-blue-500 hover:text-white transition-colors"
            >
              Редагувати
            </button>
            <button
              v-if="order.status !== 3"
              @click="refuseOrder(order.id)"
              class="text-lg font-bold text-gray-600 bg-[rgb(254,219,219)] px-2 py-1 hover:bg-[rgb(255,132,132)] hover:text-white transition-colors"
            >
              Відмовити замовлення
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="showConfirmPopup"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-xl font-bold mb-4">Підтвердження відмови від замовлення</h2>
      <p class="mb-4">Ви впевнені, що хочете відмовитися від замовлення №{{ selectedOrderId }}?</p>
      <div class="flex justify-end space-x-4">
        <button @click="cancelRefuse" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
          Скасувати
        </button>
        <button
          @click="confirmRefuse"
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Підтвердити
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import router from '@/router'
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { fetchOrders } from '@/utils/getMyOrders'
import { refuseMyOrder } from '@/utils/refuseOrder'

const store = useStore()
const user = computed(() => store.getters['authorization/getUser'])

const orders = ref([])
const showConfirmPopup = ref(false)
const selectedOrderId = ref(null)
const isRefused = ref(false)

const link = (orderId) => {
  router.push({ name: 'edit-order' })
  store.dispatch('order/fetchOrder', { userId: user.value.id, orderId: orderId })
}

const refuseOrder = (orderId) => {
  selectedOrderId.value = orderId
  showConfirmPopup.value = true
}

const cancelRefuse = () => {
  showConfirmPopup.value = false
  selectedOrderId.value = null
}

const confirmRefuse = async () => {
  const result = await refuseMyOrder(selectedOrderId.value)
  showConfirmPopup.value = false
  selectedOrderId.value = null
  if (result) {
    isRefused.value = true
  }
}

const updateStatus = (id) => {
  switch (id) {
    case 1:
      return 'В обробці'
    case 2:
      return 'Відправлено'
    case 3:
      return 'Скасовано'
    case 4:
    case 5:
      return 'Відмовлено'
    default:
      return 'Невідомий статус'
  }
}

watch(
  user,
  () => {
    router.push({ name: 'home' })
  },
  { deep: true }
)

const initializeOrders = async () => {
  if (user.value) {
    orders.value = await fetchOrders(user.value?.id)
  }
}

watch(isRefused, (newValue) => {
  if (newValue) {
    initializeOrders()
    isRefused.value = false
  }
})
watchEffect(() => {
  if (!user.value) {
    router.push({ name: 'home' })
  }
})
onMounted(initializeOrders)
</script>
