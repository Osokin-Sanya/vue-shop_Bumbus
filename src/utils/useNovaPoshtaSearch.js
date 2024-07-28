import { ref } from 'vue'
import { debounce } from 'lodash'
import { searchDepartments } from './searchDepartment'

export function useNovaPoshtaSearch(store) {
  const novaPoshtaDepartments = ref([])

  const searchOnDepartment = async ({ postOffice, typeRef }) => {
    const cityRef = store.getters['order/getCityRef']
    const data = await searchDepartments({ postOffice, typeRef, cityRef })
    novaPoshtaDepartments.value = data
  }

  const debouncedSearchOnDepartment = debounce(searchOnDepartment, 500)

  const searchDepartment = (event) => {
    debouncedSearchOnDepartment({
      postOffice: event.target.value,
      typeRef: '6f8c7162-4b72-4b0a-88e5-906948c6a92f'
    })
  }

  const searchDepartmentPostomat = (event) => {
    debouncedSearchOnDepartment({
      postOffice: event.target.value,
      typeRef: 'f9316480-5f2d-425d-bc2c-ac7cd29decf0'
    })
  }

  return {
    novaPoshtaDepartments,
    searchDepartment,
    searchDepartmentPostomat
  }
}
