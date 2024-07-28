import supabase from '../supabaseClient'

export const fetchOrders = async (userId) => {
  try {
    const { data, error } = await supabase.from('orders').select().in('user', [userId])
    if (error) {
      console.error('Error retrieving basket:', error.message)
    } else {
      return data.sort((a, b) => b.id - a.id)
    }
  } catch (error) {
    console.error('Error retrieving basket:', error.message)
  }
}
