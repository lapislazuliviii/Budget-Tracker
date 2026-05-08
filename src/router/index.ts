// Router configuration — maps URL paths to page components
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/pages/HomeView.vue'

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
      // Lazy-loaded routes — only downloaded when the user navigates to them
      component: () => import('@/pages/ExpensesView.vue'),
    },
    {
      path: '/stats',
      name: 'stats',
      component: () => import('@/pages/StatsView.vue'),
    },
    {
      path: '/goals',
      name: 'goals',
      component: () => import('@/pages/GoalsView.vue'),
    },
  ],
})

export default router
