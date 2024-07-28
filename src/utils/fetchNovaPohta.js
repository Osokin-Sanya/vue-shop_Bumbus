import axios from 'axios'

const key = '7e633625a317ed20a9dda9832b4c77c0'
const url = 'https://api.novaposhta.ua/v2.0/json/'
let isLoading = false
const basePayload = {
  apiKey: key
}

export const fetchData = async (payload) => {
  if (isLoading) return []

  try {
    isLoading = true

    const response = await axios.post(url, Object.assign(basePayload, payload), {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.data.success) {
      return response.data.data
    } else {
      console.error('Error fetching data from Nova Poshta:', response.data.errors)
      return []
    }
  } catch (error) {
    console.error('Error fetching data from Nova Poshta:', error)
    return []
  } finally {
    isLoading = false
  }
}
