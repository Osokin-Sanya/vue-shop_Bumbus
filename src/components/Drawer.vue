<template>
  <div class="fixed top-0 left-0 w-full h-full bg-black/50 z-10">
    <div class="bg-white w-1/3 h-full fixed top-0 right-0 p-10">
      <DrawerHead />
      <div v-if="!basket.length" class="mt-40 mb-10">
        <InfoBlock
          title="Кошик порожній"
          description="Виберіть товар для оформлення замовлення"
          image-url="/package-icon.png"
        />
      </div>
      <BasketList :items="items" />
      <div v-if="basket.length">
        <div class="flex gap-5 my-7">
          <span>Разом:</span>
          <div class="flex-1 border-b border-d"></div>
          <b>{{ totalPrice }} грн</b>
        </div>

        <button
          @click="link"
          :disabled="!basket.length"
          class="bg-lime-500 text-white w-full mt-7 cursor-pointer disabled:bg-slate-400 rounded-xl py-3 text-white hover:bg-lime-600 transition"
        >
          Оформити замовлення
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { calculateTotalPrice } from '@/utils/utils'
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'

import BasketList from './BasketList.vue'
import DrawerHead from './DrawerHead.vue'
import InfoBlock from './InfoBlock.vue'
import router from '@/router'

const store = useStore()
const basket = computed(() => store.getters['basket/getBasketItems'])

const items = ref([])

let totalPrice = ref(0)

const link = async () => {
  try {
    await router.push({ name: 'order' })
    await store.dispatch('basket/toggleDrawer')
    await store.dispatch('order/falseOrderMode')
  } catch (error) {
    console.error('Error during navigation or dispatch:', error)
  }
}

watch(basket, (newVal) => {
  items.value = basket.value
  totalPrice.value = calculateTotalPrice(newVal)
})
</script>
