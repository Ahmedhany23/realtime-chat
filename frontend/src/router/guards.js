import { useAuth } from '@/features/auth/composables/useAuth'

export const authGuard = (to, _) => {
  const { isAuthenticated } = useAuth()

  if (to.meta.requiresAuth && !isAuthenticated) {
    return '/login'
  }

  // Prevent logged user from opening login page or register page
  if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
    return '/'
  }

  return true
}
