import { updateItemsStatus } from '../utils/utils'
import supabase from '../supabaseClient'

export default {
  namespaced: true,
  state: {
    items: [],
    currentItem: []
  },
  mutations: {
    SET_ITEMS(state, items) {
      state.items = items
    },
    SET_ITEM(state, item) {
      state.currentItem = item
    },
    UPDATE_ITEMS_STATUS(state, data) {
      if (data) {
        state.items = updateItemsStatus(state.items, data)
      }
    }
  },
  actions: {
    async fetchItems({ commit }) {
      try {
        const { data, error } = await supabase
          .from('shopItems')
          .select('id, title, price, imageUrl')
        if (error) {
          console.error('Fetch items error:', error.message)
        } else {
          commit('SET_ITEMS', data)
        }
      } catch (error) {
        console.error('Fetch items error:', error.message)
      }
    },
    async fetchFavoriteIds({ commit, rootState }) {
      try {
        const userId = rootState?.authorization?.user?.id
        const { data, error } = await supabase.from('users').select('favorites').eq('id', userId)
        if (error) {
          console.error('Fetch user favorites error:', error.message)
        } else {
          const favorites = data.length > 0 ? data[0].favorites : []
          commit('favorites/SET_FAVORITE_ITEMS_ID', favorites, { root: true })
        }
      } catch (error) {
        console.error('Fetch user favorites error:', error.message)
      }
    },
    async fetchBasketIds({ commit, rootState }) {
      try {
        const userId = rootState?.authorization?.user?.id
        const { data, error } = await supabase.from('users').select('basket').eq('id', userId)
        if (error) {
          console.error('Fetch user basket error:', error.message)
        } else {
          const basket = data.length > 0 ? data[0].basket : []
          commit('basket/SET_BASKET_ITEMS_ID', basket, { root: true })
        }
      } catch (error) {
        console.error('Fetch user basket error:', error.message)
      }
    },
    async updateItems({ commit }, data) {
      commit('UPDATE_ITEMS_STATUS', data)
    },

    async fetchCurrentItem({ commit }, userId) {
      try {
        const { data, error } = await supabase
          .from('shopItems')
          .select('*')
          .eq('id', userId)
          .single()
        if (error) {
          console.error('Fetch item error:', error.message)
        } else {
          commit('SET_ITEM', data)
        }
      } catch (error) {
        console.error('Fetch item error:', error.message)
      }
    },
    setUpdateItemsStatus({ dispatch, rootState }) {
      dispatch('updateItems', { basket: rootState.basket.basketIds })
      dispatch('updateItems', { favorites: rootState.favorites.favoriteItemsIds })
    }
  },

  getters: {
    getItems: (state) => state.items,
    getCurrentItem: (state) => state.currentItem
  }
}
