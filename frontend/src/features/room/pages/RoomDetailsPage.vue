<script setup>
import { useAuth } from '@/features/auth/composables/useAuth'
import { socket } from '@/lib/socket'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import RoomHeader from '../components/RoomHeader.vue'
import RoomInput from '../components/RoomInput.vue'
import RoomMessages from '../components/RoomMessages.vue'
import RoomSidebar from '../components/RoomSidebar.vue'
import { useRooms } from '../composable/useRooms'

const route = useRoute()
const { currentRoom, messages, fetchRoomById, fetchRoomMessages, error, addMessage, loading } =
  useRooms()
const { user } = useAuth()

const roomId = route.params.id
const messageInput = ref('')

const roomMessages = ref(null)

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

  socket.auth = {
    token: localStorage.getItem('token'),
  }
  if (!socket.connected) {
    socket.connect()
  }
  socket.emit('join-room', { roomId })
  socket.on('new-message', handleNewMessage)

  roomMessages.value?.scrollToBottom()
})

onUnmounted(() => {
  socket.emit('leave-room', roomId)
  socket.off('new-message', handleNewMessage)
})

const handleSend = async () => {
  if (!messageInput.value.trim()) return
  socket.emit('send-message', { roomId, text: messageInput.value.trim() })
  messageInput.value = ''
}
</script>

<template>
  <div
    v-if="error"
    class="flex h-dvh overflow-hidden bg-background text-foreground items-center justify-center"
  >
    <h1 class="text-2xl font-bold">Room not found</h1>
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
