<template>
  <div class="mt-4 space-y-2">
    <div class="mt-4 space-y-2">
      <form @submit.prevent="handleSubmit">
        <div>
          <label for="address" class="block text-sm font-medium text-gray-700">Вулиця</label>
          <input
            :disabled="!cityRef"
            required
            type="text"
            id="address"
            v-model="delivery.courierAddress.street"
            @input="searchStreets($event)"
            @click="searchStreets($event)"
            class="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <ul v-show="streets?.length" class="border p-2 mt-1 rounded shadow absolute bg-white">
            <li
              v-for="street in streets"
              :key="street.Ref"
              @click="selectStreet(street.StreetsType, street.Description)"
              class="cursor-pointer p-1 hover:bg-gray-200"
            >
              {{ street.StreetsType }} {{ street.Description }}
            </li>
          </ul>
          <div
            v-show="!cityRef"
            class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
          >
            <p>Спочатку виберіть місто</p>
          </div>
        </div>

        <div>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label for="house" class="block text-sm font-medium text-gray-700">Будинок</label>
              <input
                :disabled="!cityRef"
                type="text"
                id="house"
                v-model="delivery.courierAddress.house"
                class="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label for="apartment" class="block text-sm font-medium text-gray-700"
                >Квартира</label
              >
              <input
                :disabled="!cityRef"
                type="text"
                id="apartment"
                v-model="delivery.courierAddress.apartment"
                class="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label for="floor" class="block text-sm font-medium text-gray-700">Поверх</label>
              <input
                :disabled="!cityRef"
                type="text"
                id="floor"
                v-model="delivery.courierAddress.floor"
                class="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
          </div>
          <div>
            <label for="cargoElevator" class="block text-sm font-medium text-gray-700"
              >Наявність вантажного ліфта</label
            >
            <select
              :disabled="!cityRef"
              id="cargoElevator"
              v-model="delivery.courierAddress.cargoElevator"
              class="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="">Оберіть</option>
              <option value="yes">Так</option>
              <option value="no">Ні</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          class="py-2 px-4 bg-green-600 w-full mt-4 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          Зберегти
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { delivery } from '@/utils/data'
import { defineProps } from 'vue'

const props = defineProps({
  cityRef: String,
  searchStreets: Function,
  streets: Array,
  onSave: Function,
  selectStreet: Function
})

const handleSubmit = () => {
  if (
    delivery.value.courierAddress.house &&
    delivery.value.courierAddress.apartment &&
    delivery.value.courierAddress.floor &&
    delivery.value.courierAddress.cargoElevator
  ) {
    props.onSave()
  }
}
</script>
