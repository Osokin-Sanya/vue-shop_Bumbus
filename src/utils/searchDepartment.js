import { fetchData } from './fetchNovaPohta'

export const searchDepartments = async ({ postOffice, typeRef, cityRef = 'no' }) => {
  const payload = {
    modelName: 'AddressGeneral',
    calledMethod: 'getWarehouses',
    methodProperties: {
      TypeOfWarehouseRef: typeRef,
      FindByString: postOffice,
      CityRef: cityRef,
      Limit: 10
    }
  }

  return fetchData(payload)
}
