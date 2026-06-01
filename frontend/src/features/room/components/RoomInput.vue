<script setup>
import { computed } from 'vue'
import { Send } from '@lucide/vue'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  roomName: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'send'])

const value = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const handleKeydown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    emit('send')
  }
}
</script>

<template>
  <footer class="px-6 pt-3 pb-4 border-t border-border bg-card shrink-0">
    <div class="flex items-end gap-2">
      <Textarea
        v-model="value"
        :placeholder="`Message #${roomName || '…'}`"
        rows="1"
        class="flex-1 resize-none max-h-36 overflow-y-auto"
        @keydown="handleKeydown"
      />

      <Button
        :disabled="!value.trim()"
        class="gap-1.5 shrink-0"
        @click="emit('send')"
      >
        <Send :size="15" />
      </Button>
    </div>

    <p class="mt-2 text-[0.68rem] text-muted-foreground">
      Press
      <kbd class="rounded border border-border bg-muted px-1 py-px text-[0.65rem]">
        Enter
      </kbd>
      to send ·
      <kbd class="rounded border border-border bg-muted px-1 py-px text-[0.65rem]">
        Shift+Enter
      </kbd>
      for new line
    </p>
  </footer>
</template>