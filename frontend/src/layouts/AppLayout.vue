<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, User } from '@lucide/vue'
import { computed, onMounted } from 'vue'
import { useAuth } from '@/features/auth/composables/useAuth'

import { Sun } from '@lucide/vue'
import { Moon } from '@lucide/vue'
import { useTheme } from '@/shared/composables/useTheme'

const router = useRouter()
const { logout, initAuth, user } = useAuth()
const { theme, toggleTheme } = useTheme()

const initials = computed(() => {
  const name = user.value?.displayName || user.value?.username || '?'

  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

function handleLogout() {
  logout()
  router.push('/login')
}

onMounted(() => {
  initAuth()
})
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Navbar -->
    <header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div class="container flex h-14 items-center px-4 mx-auto">
        <!-- Brand -->
        <div class="mr-auto flex items-center gap-2">
          <span class="font-semibold text-sm">Realtime Chat</span>
        </div>

        <!-- User dropdown -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" class="relative h-8 w-8 rounded-full">
              <Avatar class="h-8 w-8">
                <AvatarFallback>{{ initials }}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent class="w-56" align="end">
            <DropdownMenuLabel>
              <div class="flex flex-col space-y-1">
                <p class="text-sm font-medium leading-none">
                  {{ user?.displayName || user?.username }}
                </p>
                <p class="text-xs leading-none text-muted-foreground">
                  {{ user?.email }}
                </p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem class="cursor-pointer" @click="router.push('/')">
              <User class="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem class="cursor-pointer" @click="toggleTheme">
              <div v-if="theme === 'dark'" class="flex items-center gap-5"><Sun /> Light</div>
              <div v-else class="flex items-center gap-5"><Moon /> Dark</div>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              class="cursor-pointer text-destructive focus:text-destructive"
              @click="handleLogout"
            >
              <LogOut class="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>

    <!-- Page content -->
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>
