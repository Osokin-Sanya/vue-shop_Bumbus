export function updateItemsStatus(items, upItems) {
  if (upItems.favorites) {
    return items.map((item) => ({
      ...item,
      isFavorite: upItems.favorites.some((favItem) => favItem === item.id)
    }))
  }
  if (upItems.basket) {
    return items.map((item) => ({
      ...item,
      isAdded: upItems.basket.some((basketItem) => basketItem === item.id)
    }))
  }

  return items
}

export function calculateTotalPrice(items, includeAmount = false) {
  return items.reduce((total, item) => {
    const price = includeAmount ? item.price * item.amount : item.price
    return total + price
  }, 0)
}
