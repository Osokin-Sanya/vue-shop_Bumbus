import { ref } from 'vue'

export const delivery = ref({
  method: 'Виберіть спосіб доставки',
  selfPickupNovaPoshta: '',
  selfPickupPostomat: '',
  courierAddress: {
    street: '',
    house: '',
    apartment: '',
    cargoElevator: '',
    floor: ''
  },
  deliveryCost: 0,
  comment: ''
})
export const contact = ref({
  firstName: '',
  lastName: '',
  phone: '',
  email: ''
})

export const address = ref({
  city: '',
  region: ''
})

export const deliveryOptions = [
  { value: 'selfPickupNovaPoshta', label: 'Самовивіз з Нової Пошти', price: 99 },
  { value: 'selfPickupPostomat', label: 'Самовивіз з поштомату', price: 150 },
  { value: 'courier', label: "Кур'єром на вашу адресу", price: 200 }
]
