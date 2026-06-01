<script setup>
import 'vue-sonner/style.css'
import { Toaster } from './components/ui/sonner'
import './style.css'
import { useTheme } from './shared/composables/useTheme'

useTheme()
</script>

<template>
  <router-view></router-view>
  <Toaster position="top-right" />
</template>

<style scoped></style>
