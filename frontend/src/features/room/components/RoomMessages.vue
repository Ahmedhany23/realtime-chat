<script setup>
import { computed, nextTick, ref } from 'vue'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { MessageCircle, Clock } from '@lucide/vue'

const props = defineProps({
  messages: Array,
  loading: Boolean,
  userId: String,
})

const formatTime = (dateStr) =>
  new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })

const isOwnMessage = (msg) => msg.user?._id === props.userId

const groupedMessages = computed(() => {
  const groups = []
  let lastDate = null
  for (const msg of props.messages ?? []) {
    const date = new Date(msg.createdAt).toDateString()
    if (date !== lastDate) {
      groups.push({ type: 'date', label: formatDate(msg.createdAt), key: date })
      lastDate = date
    }
    groups.push({ type: 'message', data: msg, key: msg._id })
  }
  return groups
})

const bottomAnchor = ref(null)

const scrollToBottom = async () => {
  await nextTick()
  bottomAnchor.value?.scrollIntoView({ behavior: 'auto', block: 'end' })
}

defineExpose({ scrollToBottom })
</script>

<template>
  <div class="flex-1 px-6 py-4 overflow-y-auto" ref="messagesContainer">
    <!-- Loading skeleton -->
    <div v-if="loading" class="flex flex-col gap-5">
      <div
        v-for="i in 6"
        :key="i"
        class="flex items-start gap-3"
        :class="i % 3 === 0 ? 'flex-row-reverse' : ''"
      >
        <Skeleton class="w-9 h-9 rounded-full shrink-0" />
        <div class="flex flex-col gap-2">
          <Skeleton class="h-3 w-20" />
          <Skeleton :class="`h-10 ${i % 2 === 0 ? 'w-64' : 'w-48'}`" />
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="!messages.length"
      class="flex flex-1 flex-col items-center justify-center gap-2 py-20 text-muted-foreground"
    >
      <MessageCircle :size="48" class="text-primary/30 mb-2" />
      <p class="text-sm font-semibold text-muted-foreground">No messages yet</p>
      <p class="text-xs">Be the first to say something!</p>
    </div>

    <!-- Grouped messages -->
    <template v-else>
      <template v-for="item in groupedMessages" :key="item.key">
        <!-- Date separator -->
        <div
          v-if="item.type === 'date'"
          class="flex items-center gap-3 my-4 text-[0.7rem] font-semibold uppercase tracking-widest text-muted-foreground"
        >
          <Separator class="flex-1" />
          {{ item.label }}
          <Separator class="flex-1" />
        </div>

        <!-- Message bubble -->
        <div
          v-else
          class="flex items-start gap-2.5 max-w-[75%] mb-1.5 animate-in fade-in slide-in-from-bottom-1 duration-200"
          :class="isOwnMessage(item.data) ? 'ml-auto flex-row-reverse' : ''"
        >
          <!-- Avatar -->
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 select-none"
            :class="isOwnMessage(item.data) ? 'bg-blue-500' : 'bg-primary'"
            :title="item.data.user?.username"
          >
            {{ (item.data.user?.displayName || item.data.user?.username || '?')[0].toUpperCase() }}
          </div>

          <!-- Content -->
          <div class="flex flex-col gap-1" :class="isOwnMessage(item.data) ? 'items-end' : ''">
            <div
              class="flex items-center gap-2 text-[0.68rem] text-muted-foreground"
              :class="isOwnMessage(item.data) ? 'flex-row-reverse' : ''"
            >
              <span class="font-semibold">{{
                item.data.user?.displayName || item.data.user?.username
              }}</span>
              <span class="flex items-center gap-1">
                <Clock :size="9" />
                {{ formatTime(item.data.createdAt) }}
              </span>
            </div>
            <div
              class="px-3.5 py-2 text-sm leading-relaxed rounded-2xl border border-border break-words whitespace-pre-wrap"
              :class="
                isOwnMessage(item.data)
                  ? 'rounded-tr-none bg-primary text-primary-foreground border-primary'
                  : 'rounded-tl-none bg-muted text-foreground'
              "
            >
              {{ item.data.text }}
            </div>
          </div>
        </div>
      </template>
    </template>

    <div ref="bottomAnchor"></div>
  </div>
</template>
