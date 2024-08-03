<template>
  <div v-show="isLoading" class="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg">
    <h1 class="text-4xl font-bold mb-6 text-gray-900">{{ item.title }}</h1>
    <div class="flex flex-wrap items-start">
      <div class="w-full md:w-1/3 p-2">
        <img
          class="w-full h-64 object-cover rounded-lg shadow-md"
          :src="item.imageUrl"
          alt="Product Image"
        />
      </div>
      <div class="w-full md:w-2/3 p-2">
        <div class="p-6 border rounded-lg shadow-md bg-gray-50">
          <p class="text-lg mb-4 text-gray-700">{{ item.description }}</p>
          <p class="text-3xl font-semibold text-gray-900 mb-4">{{ item.price }} грн</p>
          <div v-show="userId" class="flex justify-end gap-5">
            <button @click="handleClickToFavorite">
              <img
                class="border-[1px] hover:border-[rgb(255,93,141)] rounded-[10px] hover:shadow-xl duration-300 hover:scale-110 hover:border-[#a3a3a3]"
                :src="!isFavorite ? '/like-1.svg' : '/like-2.svg'"
                alt=""
              />
            </button>
            <button @click="handleClickToBasket">
              <img
                class="border-[1px] rounded-[10px] hover:scale-110 hover:border-[rgb(175,255,0)]"
                :src="isBasket ? '/checked.svg' : '/plus.svg'"
                alt=""
              />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-12">
      <h2 class="text-3xl font-bold mb-4 text-gray-900">Відгуки</h2>
      <div class="p-6 border rounded-lg shadow-md bg-gray-50">
        <p v-if="reviews.length === 0" class="text-gray-600">Немає відгуків поки що.</p>
        <div v-else>
          <div
            v-for="review in reviews"
            :key="review.id"
            class="mb-4 p-4 border rounded-lg shadow-sm bg-white relative"
          >
            <h3 class="text-lg font-semibold text-gray-800">{{ review.username }}</h3>
            <p class="text-gray-700">{{ review.content }}</p>
            <p class="text-sm text-gray-500">{{ review.created_at.slice(0, 10) }}</p>
            <button
              v-show="review.user_id === userId"
              @click="deleteReview(review.id)"
              class="absolute top-2 right-2 text-red-600 hover:text-red-800"
            >
              Видалити
            </button>
          </div>
        </div>

        <form v-show="userId" @submit.prevent="addReview" class="mt-4">
          <textarea
            v-model="content"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            rows="4"
            placeholder="Напишіть ваш відгук тут..."
          ></textarea>
          <button
            type="submit"
            class="mt-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Додати відгук
          </button>
        </form>
      </div>
    </div>
    <router-link
      to="/"
      class="text-xl font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-300 mt-8 block text-center"
    >
      На головну сторінку
    </router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const route = useRoute()
const productId = route.params.id

const item = computed(() => store.getters['items/getCurrentItem'])
const items = computed(() => store.getters['items/getItems'])
const getUser = computed(() => store.getters['authorization/getUser'])
const getReviews = computed(() => store.getters['reviews/getReviews'])
const getFavoriteItemsId = computed(() => store.getters['favorites/getFavoriteItemsId'])
const getBasketIds = computed(() => store.getters['basket/getBasketIds'])

const isLoading = ref(false)
const isFavorite = ref(false)
const isBasket = ref(false)
const userId = ref(getUser.value?.id)
const content = ref('')
const reviews = ref([])

const updateStatus = () => {
  const productIdNumber = Number(productId)
  isFavorite.value = getFavoriteItemsId.value.includes(productIdNumber)
  isBasket.value = getBasketIds.value.includes(productIdNumber)
}

const handleClickToFavorite = () => {
  const productIdNumber = Number(productId)
  if (!isFavorite.value) {
    store.dispatch('favorites/addToFavorite', productIdNumber)
    isFavorite.value = true
  } else {
    store.dispatch('favorites/removeFromFavorite', productIdNumber)
    isFavorite.value = false
  }
}

const handleClickToBasket = () => {
  const productIdNumber = Number(productId)
  if (!isBasket.value) {
    store.dispatch('basket/addToBasket', productIdNumber)
    isBasket.value = true
  } else {
    store.dispatch('basket/removeToBasket', productIdNumber)
    isBasket.value = false
  }
}

const addReview = async () => {
  if (content.value.trim() === '') {
    return
  }
  await store.dispatch('reviews/addReview', [userId.value, productId, content.value])

  const lastReview = getReviews.value[getReviews.value.length - 1]?.id || []
  const review = {
    id: lastReview + 1,
    content: content.value.trim(),
    created_at: new Date().toISOString().slice(0, 10),
    username: getUser.value.user_metadata.name,
    user_id: userId.value
  }
  reviews.value.unshift(review)
  content.value = ''
}

const deleteReview = (reviewId) => {
  store.dispatch('reviews/deleteReview', [userId.value, reviewId])
  reviews.value = reviews.value.filter((review) => review.id !== reviewId)
}

watch(getBasketIds, () => {
  updateStatus()
})

watch(getReviews, () => {
  reviews.value = getReviews.value
})

watch(getUser, () => {
  userId.value = getUser.value?.id
})

const fetchItemId = async () => {
  if (items.value.length === 0) {
    await store.dispatch('items/fetchFavoriteIds')
  }
  updateStatus()
}

onMounted(async () => {
  fetchItemId()
  await store.dispatch('items/fetchCurrentItem', productId)
  await store.dispatch('reviews/getReviews', productId)
  isLoading.value = true
})
</script>
