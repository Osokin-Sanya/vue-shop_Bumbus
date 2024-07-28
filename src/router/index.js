import { createRouter, createWebHistory } from 'vue-router'

import Home from '../pages/Home.vue'
import Favorites from '../pages/Favorites.vue'

import DetailCard from '../pages/DetailCard.vue'
import Order from '../pages/OrderForm.vue'
import MyOrders from '../pages/MyOrders.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/favorites', name: 'favorites', component: Favorites },
  { path: '/order', name: 'order', component: Order },
  {
    path: '/edit-order',
    name: 'edit-order',
    props: true,
    component: Order
  },
  { path: '/my-orders', name: 'my-orders', component: MyOrders },
  { path: '/product/:id', name: 'product', component: DetailCard }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
