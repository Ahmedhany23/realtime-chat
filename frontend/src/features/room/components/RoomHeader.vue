<script setup>
import { Lock, Hash, MessageCircle } from '@lucide/vue'

defineProps({
  room: Object,
  messageCount: Number,
})
</script>

<template>
  <header
    class="flex items-center justify-between px-6 py-3.5 border-b border-border bg-card shrink-0"
  >
    <div class="flex items-center gap-2 text-sm font-semibold text-foreground">
      <span class="text-primary">
        <Lock v-if="room?.isPrivate" :size="15" />
        <Hash v-else :size="15" />
      </span>
      {{ room?.name ?? 'Loading…' }}
    </div>
    <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
      <MessageCircle :size="14" class="text-primary" />
      {{ messageCount }} messages
    </div>
  </header>
</template>
