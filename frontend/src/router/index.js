import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/features/home/pages/HomePage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/rooms/:id',
      component: () => import('@/features/room/pages/RoomDetailsPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      component: () => import('@/features/auth/pages/LoginPage.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      component: () => import('@/features/auth/pages/RegisterPage.vue'),
      meta: { requiresAuth: false },
    },
  ],
})

router.beforeEach(authGuard)

export default router
