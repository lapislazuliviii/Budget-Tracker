// Router configuration — maps URL paths to page components
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/pages/HomeView.vue'
import ExpensesView from '@/pages/ExpensesView.vue'
import StatsView from '@/pages/StatsView.vue'
import GoalsView from '@/pages/GoalsView.vue'

const router = createRouter({
  // Use HTML5 history mode for clean URLs (no # in the URL)
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/expenses',
      name: 'expenses',
      component: ExpensesView,
    },
    {
      path: '/stats',
      name: 'stats',
      component: StatsView,
    },
    {
      path: '/goals',
      name: 'goals',
      component: GoalsView,
    },
  ],
})

export default router
