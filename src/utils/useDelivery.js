import { computed, ref, watch, watchEffect } from 'vue'
import { delivery, deliveryOptions } from './data'
import { useNovaPoshtaSearch } from './useNovaPoshtaSearch'

export function useDelivery(store) {
  const { searchDepartment, searchDepartmentPostomat, novaPoshtaDepartments } =
    useNovaPoshtaSearch(store)

  const order = computed(() => store.getters['order/getOrder'])
  const editMode = computed(() => store.getters['order/getOrderMode'])

  const selectedOption = ref('')
  const isEditingDelivery = ref(false)

  const resetDelivery = (isEdit = false) => {
    const baseDelivery = {
      method: isEdit ? order.value.method : 'Виберіть спосіб доставки',
      selfPickupNovaPoshta: '',
      selfPickupPostomat: '',
      courierAddress: {
        street: '',
        house: '',
        apartment: '',
        cargoElevator: '',
        floor: ''
      },
      deliveryCost: isEdit ? order.value.deliveryCost : 0,
      comment: isEdit ? order.value.comment : ''
    }

    if (isEdit) {
      const address = order.value.address || {}
      baseDelivery.selfPickupNovaPoshta = address.selfPickupNovaPoshta || ''
      baseDelivery.selfPickupPostomat = address.selfPickupPostomat || ''
      Object.assign(baseDelivery.courierAddress, address.courierAddress || {})
    }

    delivery.value = baseDelivery
  }

  watchEffect(() => {
    resetDelivery(order.value && editMode.value)
  })

  watchEffect(() => {
    const resetFields = {
      selfPickupNovaPoshta: '',
      selfPickupPostomat: '',
      courierAddress: {}
    }

    const optionActions = {
      selfPickupNovaPoshta: () => {
        Object.assign(delivery.value, {
          ...resetFields,
          selfPickupNovaPoshta: delivery.value.selfPickupNovaPoshta,
          deliveryCost: deliveryOptions.find((option) => option.value === 'selfPickupNovaPoshta')
            .price
        })
        novaPoshtaDepartments.value = []
      },
      selfPickupPostomat: () => {
        Object.assign(delivery.value, {
          ...resetFields,
          selfPickupPostomat: delivery.value.selfPickupPostomat,
          deliveryCost: deliveryOptions.find((option) => option.value === 'selfPickupPostomat')
            .price
        })
        novaPoshtaDepartments.value = []
      },
      courier: () =>
        Object.assign(delivery.value, {
          ...resetFields,
          deliveryCost: deliveryOptions.find((option) => option.value === 'courier').price
        })
    }

    const action = optionActions[selectedOption.value]
    if (action) action()
  })

  const changesSelectedOptionsDelivery = (options, method, price) => {
    selectedOption.value = options
    delivery.value.method = method
    store.dispatch('order/setDeliveryCost', price)
  }

  watch(
    order,
    async () => {
      if (order.value) {
        await store.dispatch('order/setDeliveryCost', Number(order.value.deliveryCost))
      }
    },
    { deep: true }
  )
  watchEffect(async () => {
    if (!editMode.value) {
      await store.dispatch('order/setDeliveryCost', 0)
      await store.dispatch('order/setCityRef', '')
    }
  })
  const selectDepartment = (department) => {
    const optionKeyMap = {
      selfPickupNovaPoshta: 'selfPickupNovaPoshta',
      selfPickupPostomat: 'selfPickupPostomat'
    }

    const key = optionKeyMap[selectedOption.value]
    if (key) {
      delivery.value[key] = department.Description
    }
  }

  return {
    selectedOption,
    isEditingDelivery,
    changesSelectedOptionsDelivery,
    deliveryOptions,
    selectDepartment,
    searchDepartment,
    searchDepartmentPostomat,
    novaPoshtaDepartments
  }
}
