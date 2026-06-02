import { useAuth } from '@/features/auth/composables/useAuth'

export const authGuard = async (to, _) => {
  const { initAuth, isAuthenticated, user } = useAuth()

  if (to.meta.requiresAuth) {
    if (!isAuthenticated.value) {
      return '/login'
    }
    if (!user.value) {
      await initAuth()
    }
  }

  // Prevent logged user from opening login page or register page
  if ((to.path === '/login' || to.path === '/register') && isAuthenticated.value) {
    return '/'
  }

  return true
}
