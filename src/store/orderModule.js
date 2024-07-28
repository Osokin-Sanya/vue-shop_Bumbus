import supabase from '../supabaseClient'

const setOrder = (order) => {
  const { address, basket, contact, delivery, cityRef, deliveryCost } = order

  const { courierAddress, selfPickupNovaPoshta, selfPickupPostomat, comment, method } = delivery
  const objOrder = {
    contact: contact,
    products: basket,
    address: { address, courierAddress, selfPickupNovaPoshta, selfPickupPostomat },
    comment: comment,
    method: method,
    cityRef: cityRef,
    status: 1,
    deliveryCost: deliveryCost
  }
  return objOrder
}

export default {
  namespaced: true,
  state: {
    orderMode: false,
    order: {},
    contact: {},
    address: {},
    delivery: {},
    basket: [],
    deliveryCost: 0,
    cityRef: '',
    currentOrderId: null
  },
  mutations: {
    SET_CONTACT(state, contact) {
      state.contact = contact
    },
    SET_ADDRESS(state, address) {
      state.address = address
    },
    SET_CITYREF(state, cityRef) {
      state.cityRef = cityRef
    },
    SET_DELIVERY(state, delivery) {
      state.delivery = delivery
    },
    SET_BASKET(state, basket) {
      state.basket = basket
    },
    SET_DELIVERY_COST(state, deliveryCost) {
      state.deliveryCost = deliveryCost
    },
    SET_ORDER(state, order) {
      state.order = order
    },
    SET_ORDER_MODE(state, orderMode) {
      state.orderMode = orderMode
    },
    FALSE_ORDER_MODE(state) {
      state.orderMode = false
    },
    SET_CURRENT_ORDER_ID(state, orderId) {
      state.currentOrderId = orderId
    }
  },
  actions: {
    async fetchOrders({ commit }) {
      const { data, error } = await supabase.from('orders').select()

      if (error) {
        console.error('Error fetch orderы:', error.message)
      } else {
        commit('SET_ORDERS', data)
      }
    },
    async postOrder({}, order) {
      const { error } = await supabase.from('orders').insert(setOrder(order))

      if (error) {
        console.error('Error posting order:', error.message)
      } else {
        return true
      }
    },
    async updatedMyOrder({ state }, order) {
      try {
        const { error } = await supabase
          .from('orders')
          .upsert({ id: state.currentOrderId, ...setOrder(order) })

        if (error) {
          console.error('Error retrieving orders:', error.message)
        } else {
          return true
        }
      } catch (error) {
        console.error('Error retrieving orders:', error.message)
      }
    },

    async fetchOrder({ commit, dispatch }, { userId, orderId }) {
      commit('SET_ORDER_MODE', true)
      commit('SET_CURRENT_ORDER_ID', orderId)
      try {
        const { data, error } = await supabase
          .from('orders')
          .select()
          .in('id', [orderId])
          .eq('user', [userId])

        if (error) {
          console.error('Error retrieving orders:', error.message)
        } else {
          commit('SET_ORDER', data[0])

          dispatch('setCityRef', data[0].cityRef)
        }
      } catch (error) {
        console.error('Error retrieving orders:', error.message)
      }
    },

    editMode({ commit }, orderMode) {
      commit('SET_ORDER_MODE', orderMode)
    },
    setContact({ commit }, contact) {
      commit('SET_CONTACT', contact)
    },
    setAddress({ commit }, address) {
      commit('SET_ADDRESS', address)
    },
    setCityRef({ commit }, cityRef) {
      commit('SET_CITYREF', cityRef)
    },
    setDelivery({ commit }, delivery) {
      commit('SET_DELIVERY', delivery)
    },
    finalBasket({ commit }, basket) {
      commit('SET_BASKET', basket)
    },
    setDeliveryCost({ commit }, deliveryCost) {
      commit('SET_DELIVERY_COST', deliveryCost)
    },
    falseOrderMode({ commit }) {
      commit('FALSE_ORDER_MODE')
    }
  },

  getters: {
    getCityRef: (state) => state.cityRef,
    getContact: (state) => state.contact,
    getAddress: (state) => state.address,
    getDelivery: (state) => state.delivery,
    getBasket: (state) => state.basket,
    getDeliveryCost: (state) => state.deliveryCost,
    getOrder: (state) => state.order,
    getOrderMode: (state) => state.orderMode,
    getAllData: (state, getters) => {
      return {
        orders: getters.getOrders,
        cityRef: getters.getCityRef,
        contact: getters.getContact,
        address: getters.getAddress,
        delivery: getters.getDelivery,
        basket: getters.getBasket,
        deliveryCost: getters.getDeliveryCost
      }
    }
  }
}
