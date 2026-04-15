import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from './views/Dashboard.vue'
import Report from './views/Report.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/report',
    name: 'Report',
    component: Report
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router