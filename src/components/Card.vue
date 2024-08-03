<template>
  <div
    class="relative bg-white border border-slate-100 rounded-3xl p-8 hover:-translate-y-2 hover:shadow-xl transition"
  >
    <img
      v-show="user"
      class="absolute top-8 left-8 cursor-pointer border-[1px] hover:border-[rgb(255,93,141)] rounded-[10px] hover:shadow-xl duration-300 hover:scale-110 hover:border-[#a3a3a3]"
      :src="!isFavorite ? '/like-1.svg' : '/like-2.svg'"
      alt="like"
      @click="handleClickToFavorite"
    />

    <router-link :to="{ name: 'product', params: { id: id } }">
      <img :src="imageUrl" alt="like" />
      <p class="my-3">{{ title }}</p>
    </router-link>

    <div class="flex justify-between mb-5">
      <div class="flex flex-col">
        <span class="text-slate-400">Ціна</span>
        <b>{{ price }}</b>
      </div>
      <div
        class="hover:shadow-2xl duration-300 hover:scale-110 hover:border-[rgb(175,255,0)] flex items-end"
      >
        <img
          v-show="user"
          class="cursor-pointer border-[1px] rounded-[10px] hover:border-[rgb(175,255,0)]"
          @click="handleClickToCart"
          :src="isAdded ? '/checked.svg' : '/plus.svg'"
          alt="plus"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed, watch, ref } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  title: String,
  price: Number,
  imageUrl: String,
  isFavorite: Boolean,
  isAdded: Boolean,
  onClickAdd: Function,
  id: Number
})

const store = useStore()
const emit = defineEmits(['toggle-to-favorite', 'toggle-to-cart'])

const user = computed(() => store.getters['authorization/getUser'])

const handleClickToFavorite = () => {
  emit('toggle-to-favorite', { itemId: props.id, isFavorite: props.isFavorite })
}

const handleClickToCart = () => {
  emit('toggle-to-cart', { itemId: props.id, isAdded: props.isAdded })
}
</script>
