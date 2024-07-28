<template>
  <div class="mb-4">
    <div class="flex justify-between items-center">
      <p class="text-xl font-semibold mb-2">Ваше замовлення</p>
      <button class="text-slate-500 hover:text-slate-700 text-3xl" @click="$emit('close')">
        X
      </button>
    </div>
    <div>
      <p class="text-lg font-semibold">Ім'я</p>
      <p class="text-gray-900 -mt-1 mb-2">
        {{ order.contact.firstName }} {{ order.contact.lastName }}
      </p>
      <p class="text-lg font-semibold">Email</p>
      <p class="text-gray-900 -mt-1 mb-2">{{ order.contact.email }}</p>
      <p class="text-lg font-semibold">Телефон</p>
      <p class="text-gray-900 -mt-1 mb-2">{{ order.contact.phone }}</p>
    </div>
    <div>
      <p class="text-lg font-semibold">Адресса доставки</p>
      <div>
        <p class="text-gray-900">{{ order.address.city }}, {{ order.address.region }}</p>
        <p class="text-gray-900">{{ order.delivery.method }}</p>
        <p class="text-gray-900">{{ order.delivery.selfPickupNovaPoshta }}</p>
        <p class="text-gray-900">{{ order.delivery.selfPickupPostomat }}</p>
        <div v-if="order.delivery.courierAddress?.street">
          <p class="text-gray-900">
            {{ order.delivery.courierAddress.street }}, будинок
            {{ order.delivery.courierAddress.house }}, квартира
            {{ order.delivery.courierAddress.apartment }}
          </p>
        </div>
      </div>
      <div>
        <p class="text-gray-700 font-semibold">Коментар:</p>
        <p class="text-gray-900">{{ order.delivery.comment }}</p>
      </div>
    </div>
    <div class="space-y-4">
      <div v-for="item in order.basket" :key="item.id" class="flex items-center space-x-4">
        <img class="w-30 h-20 object-cover rounded-lg shadow-md" :src="item.imageUrl" alt="" />
        <div class="flex-1">
          <div class="text-lg text-gray-700">{{ item.title }}</div>
          <div class="text-gray-500">{{ item.price }} ₴</div>
        </div>
        <div class="text-lg font-bold text-gray-900 ml-auto">
          {{ item.price * item.amount }} ₴ х {{ item.amount }} од.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['order'])
</script>
