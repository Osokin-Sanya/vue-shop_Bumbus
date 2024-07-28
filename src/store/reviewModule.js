import supabase from '../supabaseClient'

export default {
  namespaced: true,
  state: {
    reviews: []
  },
  mutations: {
    SET_REVIEWS(state, reviews) {
      state.reviews = reviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }
  },
  actions: {
    async addReview({}, reviews) {
      const [userId, productId, content] = reviews

      const { data, error } = await supabase.from('reviews').insert({
        user_id: userId,
        product_id: productId,
        content: content
      })

      if (error) {
        console.error('Error adding review:', error)
        return null
      }
    },
    async deleteReview({}, review) {
      const [userId, reviewId] = review
      const { data, error } = await supabase
        .from('reviews')
        .delete()
        .match({ id: reviewId, user_id: userId })

      if (error) {
        console.error('Error deleting review:', error)
        return false
      }
    },

    async getReviews({ commit }, productId) {
      const { data, error } = await supabase.from('reviews').select('*').eq('product_id', productId)

      if (error) {
        console.error('Error fetching reviews:', error)
        return []
      }
      commit('SET_REVIEWS', data)
    }
  },
  getters: {
    getReviews: (state) => state.reviews
  }
}
