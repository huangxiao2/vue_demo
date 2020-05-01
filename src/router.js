import Vue from 'vue'
import Router from 'vue-router'

import Login from './components/Login'
import Home from './components/Home'
import WelCome from './components/WelCome'
import Users from './components/user/Users'
import Rights from './components/rights/Right'
import Roles from './components/rights/RoleList'
import OrderList from './components/order/OrderList'
import addOrder from './components/order/addOrder'
import Cate from './components/goods/Cate'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/home', component: Home, redirect: '/WelCome', children: [
      { path: '/WelCome', component: WelCome },
      { path: '/userlist', component: Users },
      { path: '/rolelist', component: Roles },
      { path: '/rightslist', component: Rights },
      { path: '/orderlist', component: OrderList },
      { path: '/addorder', component: addOrder },
      { path: '/cate', component: Cate }
    ] }
  ]
})
// 设置路由守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    return next('/login')
  }
  next()
})
export default router
