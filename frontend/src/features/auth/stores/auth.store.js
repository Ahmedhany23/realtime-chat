import { defineStore } from 'pinia'
import { loginService, meService, registerService } from '../services/auth.service'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || '',
    loading: false,
  }),

  actions: {
    async initAuth() {
      if (!this.token) return

      try {
        const user = await meService()
        this.user = user
      } catch (error) {
        this.LogOut()
      }
    },

    async login(payload) {
      try {
        this.loading = true

        const response = await loginService(payload)

        this.token = response.token
        this.user = response.user

        localStorage.setItem('token', response.token)

        return response
      } finally {
        this.loading = false
      }
    },

    async register(payload) {
      try {
        this.loading = true
        return await registerService(payload)
      } finally {
        this.loading = false
      }
    },

    LogOut() {
      this.user = null
      this.token = ''
      localStorage.removeItem('token')
    },
  },
})
