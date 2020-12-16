import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import Login from '../views/login'
import Register from '../views/register'
import Course from '../views/course'
import Detial from '../views/detial'
import Cart from '../views/cart'
import Order from "../views/order"
import Ordersuccess from "../views/ordersuccess"

Vue.use(VueRouter)

const routes = [
    {path: '/', redirect: "/home"},
    {path: '/home', component: Home},
    {path: '/login', component: Login},
    {path: '/register', component: Register},
    {path: '/course', component: Course},
    {path: '/detial', component: Detial},
    {path: '/cart', component: Cart},
    {path: '/order', component: Order},
    {path: '/ordersuccess', component: Ordersuccess},
]

const router = new VueRouter({
    mode:'history',
    routes
})

export default router
