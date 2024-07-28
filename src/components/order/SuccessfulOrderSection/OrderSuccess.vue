<template>
  <div>
    <div
      class="text-green-600 mx-14 mt-12 flex flex-col items-center bg-green-100 border border-green-400 p-4 rounded-lg shadow-lg"
    >
      <p class="text-lg font-semibold">Ваше замовлення було успішно оформлено</p>
    </div>
    <router-link :to="{ name: 'home' }">
      <div class="flex justify-center mb-12">
        <button
          class="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300"
        >
          На головну
        </button>
      </div>
    </router-link>
  </div>
</template>
