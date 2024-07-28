import supabase from '../supabaseClient'

export const refuseMyOrder = async (orderId) => {
  try {
    const { error } = await supabase.from('orders').upsert({ id: orderId, status: 3 }).select()

    if (error) {
      console.error('Error updating order:', error.message)
    } else {
      console.log('Order refused')
      return true
    }
  } catch (error) {
    console.error('Error updating order:', error.message)
  }
}
