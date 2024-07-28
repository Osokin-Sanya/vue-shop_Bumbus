import { fetchData } from './fetchNovaPohta'

export const searchOnStreets = async ({ cityRef, streetName }) => {
  const payload = {
    modelName: 'Address',
    calledMethod: 'getStreet',
    methodProperties: {
      CityRef: cityRef,
      FindByString: streetName,
      Limit: 10
    }
  }

  return fetchData(payload)
}
