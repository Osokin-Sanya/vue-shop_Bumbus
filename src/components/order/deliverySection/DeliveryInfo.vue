<template>
  <div
    v-bind="delivery"
    class="p-4 border rounded-lg shadow-sm bg-gray-50 flex justify-between items-center"
  >
    <div class="flex items-center">
      <img src="../../../../public/poshta.png" alt="Nova Poshta" class="w-6 h-6 mr-2" />
      <div class="text-lg text-gray-700">
        <div>{{ delivery.method }}</div>
        <div>
          <div v-if="delivery.selfPickupNovaPoshta">
            {{ delivery.selfPickupNovaPoshta }}
          </div>
          <div v-if="delivery.selfPickupPostomat">
            {{ delivery.selfPickupPostomat }}
          </div>
          <div v-if="delivery.courierAddress" class="flex gap-2">
            <p>{{ delivery.courierAddress.street }}</p>
            <p v-if="delivery.courierAddress.house">
              - будинок {{ delivery.courierAddress.house }},
            </p>
            <p v-if="delivery.courierAddress.floor">поверх {{ delivery.courierAddress.floor }},</p>
            <p v-if="delivery.courierAddress.apartment">
              квартира {{ delivery.courierAddress.apartment }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="text-gray-700">Відправимо завтра</div>

    <button @click="$emit('edit')" class="text-blue-600 hover:underline">Змінити</button>
  </div>
</template>

<script setup>
import { delivery } from '@/utils/data'

defineEmits(['edit'])
</script>
