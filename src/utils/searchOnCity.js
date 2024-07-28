import { fetchData } from './fetchNovaPohta'

export const searchCities = async (letter) => {
  const payload = {
    modelName: 'Address',
    calledMethod: 'getCities',
    methodProperties: {
      FindByString: letter,
      Limit: 10
    }
  }

  return fetchData(payload)
}
