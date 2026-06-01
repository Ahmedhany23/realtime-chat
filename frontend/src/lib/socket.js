import { io } from 'socket.io-client'

const token = localStorage.getItem('token')

export const socket = io('https://realtime-chat-api-weld.vercel.app', {
  auth: {
    token,
  },
})

socket.on('connect', () => {
  console.log('Connected:', socket.id)
})

socket.on('connect_error', (err) => {
  console.log('Connection Error:', err.message)
})
