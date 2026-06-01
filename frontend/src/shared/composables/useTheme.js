import { ref, onMounted } from 'vue'

const theme = ref('light')

function getInitialTheme() {
  const saved = localStorage.getItem('theme')
  if (saved) return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Apply immediately when the module is first imported (sync, before any render)
const initialTheme = getInitialTheme()
theme.value = initialTheme
document.documentElement.classList.toggle('dark', initialTheme === 'dark')

export function useTheme() {
  const applyTheme = (value) => {
    theme.value = value
    document.documentElement.classList.toggle('dark', value === 'dark')
    localStorage.setItem('theme', value)
  }

  const toggleTheme = () => {
    applyTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  onMounted(() => {
    // No-op now since module-level code already ran,
    // but kept in case this composable is used standalone
    applyTheme(getInitialTheme())
  })

  return {
    theme,
    toggleTheme,
    applyTheme,
  }
}