import supabase from '../supabaseClient'

export const fetchOrder = async (userId, orderId) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select()
      .in('id', [orderId])
      .eq('user', [userId])

    if (error) {
      console.error('Error retrieving orders:', error.message)
    } else {
      return data
    }
  } catch (error) {
    console.error('Error retrieving orders:', error.message)
  }
}
