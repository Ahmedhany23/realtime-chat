<script setup>
import { useRouter } from 'vue-router'
import { ArrowLeft, Hash, Lock, Users, Calendar, User } from '@lucide/vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const router = useRouter()

defineProps({
  room: Object,
  formatDate: Function,
})
</script>

<template>
  <aside
    class="hidden sm:flex w-70 min-w-60 flex-col gap-5 border-r border-border bg-card p-5 overflow-y-auto"
  >
    <!-- Back -->
    <Button
      variant="ghost"
      class="w-fit justify-start gap-2 text-muted-foreground px-2"
      @click="router.push('/')"
    >
      <ArrowLeft :size="16" />
      <span>All Rooms</span>
    </Button>

    <!-- Skeleton -->

    <!-- Room info -->
    <template v-if="room">
      <div class="rounded-xl border border-border bg-background p-4 flex flex-col gap-3">
        <!-- Icon + name -->
        <div class="flex items-center gap-2">
          <div
            class="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary shrink-0"
          >
            <Lock v-if="room.isPrivate" :size="18" />
            <Hash v-else :size="18" />
          </div>
          <h1 class="text-base font-bold leading-tight text-foreground truncate">
            {{ room.name }}
          </h1>
        </div>

        <!-- Badge -->
        <Badge :variant="room.isPrivate ? 'outline' : 'secondary'" class="w-fit">
          {{ room.isPrivate ? 'Private' : 'Public' }}
        </Badge>

        <!-- Description -->
        <p v-if="room.description" class="text-xs text-muted-foreground leading-relaxed">
          {{ room.description }}
        </p>
        <p v-else class="text-xs italic text-muted-foreground/60">No description.</p>

        <Separator />

        <!-- Meta -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2 text-xs text-muted-foreground">
            <User :size="13" class="text-primary shrink-0" />
            <span
              >Created by
              <strong class="text-foreground">{{
                room.createdBy?.displayName || room.createdBy?.username
              }}</strong></span
            >
          </div>
          <div class="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar :size="13" class="text-primary shrink-0" />
            <span>{{ formatDate(room.createdAt) }}</span>
          </div>
          <div
            v-if="room.members?.length"
            class="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <Users :size="13" class="text-primary shrink-0" />
            <span>{{ room.members.length }} member(s)</span>
          </div>
        </div>
      </div>
    </template>
  </aside>
</template>
