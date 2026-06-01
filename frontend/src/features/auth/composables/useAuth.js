import { computed } from 'vue'

import { useAuthStore } from '../stores/auth.store'

export const useAuth = () => {
  const authStore = useAuthStore()

  const isAuthenticated = computed(() => {
    return !!authStore.token
  })

  const user = computed(() => {
    return authStore.user
  })

  const login = authStore.login

  const register = authStore.register

  const logout = authStore.LogOut

  const initAuth = authStore.initAuth

  return {
    user,
    login,
    register,
    isAuthenticated: isAuthenticated.value,
    loading: computed(() => authStore.loading),
    logout,
    initAuth,
  }
}
