<script setup>
import { useAuth } from '@/features/auth/composables/useAuth'
import { createRoomChannel } from '@/lib/pusher'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import RoomHeader from '../components/RoomHeader.vue'
import RoomInput from '../components/RoomInput.vue'
import RoomMessages from '../components/RoomMessages.vue'
import RoomSidebar from '../components/RoomSidebar.vue'
import { useRooms } from '../composable/useRooms'
import { RoomService } from '../services/room.service'

const route = useRoute()
const { currentRoom, messages, fetchRoomById, fetchRoomMessages, error, addMessage, loading } =
  useRooms()
const { user } = useAuth()

const roomId = route.params.id
const messageInput = ref('')
const roomMessages = ref(null)
let roomSubscription = null

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString([], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

const handleNewMessage = (message) => {
  addMessage(message)
  roomMessages.value?.scrollToBottom()
}

onMounted(async () => {
  await fetchRoomById(roomId)
  await fetchRoomMessages(roomId)

  roomSubscription = createRoomChannel(roomId)
  roomSubscription.channel.bind('pusher:subscription_succeeded', () => {
    console.log('Subscribed to room channel:', roomSubscription.channelName)
  })
  roomSubscription.channel.bind('pusher:subscription_error', (status) => {
    console.error('Room subscription error:', status)
  })
  roomSubscription.channel.bind('new-message', handleNewMessage)

  roomMessages.value?.scrollToBottom()
})

onUnmounted(() => {
  if (roomSubscription) {
    roomSubscription.channel.unbind('new-message', handleNewMessage)
    roomSubscription.pusher.unsubscribe(roomSubscription.channelName)
    roomSubscription.pusher.disconnect()
    roomSubscription = null
  }
})

const handleSend = async () => {
  if (!messageInput.value.trim()) return
  try {
    const createdMessage = await RoomService.sendMessage(roomId, messageInput.value.trim())
    addMessage(createdMessage)
    roomMessages.value?.scrollToBottom()
    messageInput.value = ''
  } catch (error) {
    console.error('Failed to send message:', error)
  }
}
</script>

<template>
  <div
    v-if="error"
    class="flex h-dvh overflow-hidden bg-background text-foreground items-center justify-center"
  >
    <h1 class="text-2xl font-bold">{{ error?.message }}</h1>
  </div>

  <div v-else class="flex h-dvh overflow-hidden bg-background text-foreground">
    <RoomSidebar :room="currentRoom" :format-date="formatDate" />

    <main class="flex flex-1 flex-col overflow-hidden">
      <RoomHeader :room="currentRoom" :message-count="messages.length" />

      <RoomMessages
        ref="roomMessages"
        :messages="messages"
        :loading="loading"
        :user-id="user?._id"
      />

      <RoomInput v-model="messageInput" :room-name="currentRoom?.name" @send="handleSend" />
    </main>
  </div>
</template>
