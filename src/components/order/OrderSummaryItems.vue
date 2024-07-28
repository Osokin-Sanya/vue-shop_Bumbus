<template>
  <section class="mb-6">
    <h2 class="text-2xl font-semibold text-gray-900 mb-4">Замовлення</h2>
    <div class="p-4 border rounded-lg shadow-sm bg-gray-50">
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center">
          <img src="../../../public/logo.png" alt="logo" class="w-6 h-6 mr-2" />
          <div class="text-lg font-semibold text-gray-800">Продавець: BUMBUS</div>
        </div>
      </div>
      <LoadingSpinner v-if="itemsBasket.length === 0" />
      <div v-for="item in itemsBasket" :key="item.id" class="flex gap-5 mb-4 items-center">
        <img class="w-30 h-20 object-cover rounded-lg shadow-md" :src="item.imageUrl" alt="" />
        <div>
          <div class="text-lg text-gray-700">{{ item.title }}</div>
          <div class="text-gray-500">{{ item.price }} ₴</div>
          <button v-if="!editMode" @click="dalete(item.id)" class="text-red-500">Видалити</button>
        </div>
        <div class="text-lg font-bold text-gray-900 ml-auto">
          {{ item.price * item.amount }} ₴ х {{ item.amount }} од.
        </div>
        <div class="flex flex-col items-center">
          <button
            @click="increaseAmount(item)"
            class="bg-[#81AFF6] text-white rounded-t-lg px-2 py-1 hover:bg-blue-600 transition-colors"
          >
            <img class="w-5 h-5" src="../../../public/up-arrow.svg" alt="" />
          </button>
          <div
            class="bg-gray-100 text-gray-700 px-2 py-1 border-t border-b border-gray-300 w-full text-center"
          ></div>
          <button
            @click="decreaseAmount(item)"
            class="bg-[#81AFF6] text-white rounded-b-lg px-2 py-1 hover:bg-blue-600 transition-colors"
          >
            <img class="w-5 h-5" src="../../../public/down-arrow.svg " alt="" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { useStore } from 'vuex'
import LoadingSpinner from '../LoadingSpinner.vue'

const store = useStore()
const editMode = computed(() => store.getters['order/getOrderMode'])
const order = computed(() => store.getters['order/getOrder'])
const getBasket = computed(() => store.getters['basket/getBasketItems'])
const getBasketItems = computed(() => store.getters['basket/getBasketItems'])

const itemsBasket = ref([])
const orderItems = ref([])

const dalete = (itemId) => {
  if (!editMode.value) {
    store.dispatch('basket/removeToBasket', itemId)
  }

  orderItems.value = orderItems.value.filter((item) => item.id !== itemId)
}

const increaseAmount = (item) => {
  item.amount++
  updateBasket()
}

const decreaseAmount = (item) => {
  if (item.amount > 1) {
    item.amount--
    updateBasket()
  }
}

watchEffect(async () => {
  console.log(getBasket.value)
  if (order.value?.products?.length > 0 && editMode.value) {
    itemsBasket.value = order.value.products
  } else {
    itemsBasket.value = getBasket.value.map((item) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      amount: item.amount || 1,
      imageUrl: item.imageUrl
    }))
  }
})

const updateBasket = () => {
  store.dispatch('order/finalBasket', itemsBasket.value)
}

watch(
  itemsBasket,
  () => {
    updateBasket()
  },
  { deep: true }
)
</script>
