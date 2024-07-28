import { ref } from 'vue'
import { debounce } from 'lodash'
import { searchOnStreets } from '@/utils/searchOnStreets'

import { delivery } from './data'

export function useStreetSearch(store) {
  const streets = ref([])

  const searchStreets = async (event) => {
    const cityRef = store.getters['order/getCityRef']
    const data = await searchOnStreets({
      streetName: event.target.value,
      cityRef
    })
    streets.value = data
  }

  const selectStreet = (streetsType, description) => {
    delivery.value.courierAddress.street = streetsType + description
    streets.value = []
  }

  const debouncedSearchStreets = debounce(searchStreets, 500)

  return {
    streets,
    selectStreet,
    searchStreets: debouncedSearchStreets
  }
}
