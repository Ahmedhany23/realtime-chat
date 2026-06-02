import Pusher from 'pusher-js'
import { api } from '@/shared/lib/axios'

Pusher.logToConsole = import.meta.env.DEV

export const createRoomChannel = (roomId) => {
  const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
    cluster: import.meta.env.VITE_PUSHER_CLUSTER,
    channelAuthorization: {
      endpoint: `${import.meta.env.VITE_API_URL}/pusher/auth`,
      transport: 'ajax',
      customHandler: async ({ socketId, channelName }, callback) => {
        try {
          const response = await api.post('/pusher/auth', {
            socket_id: socketId,
            channel_name: channelName,
          })
          callback(null, response.data)
        } catch (error) {
          callback(error, null)
        }
      },
    },
  })

  pusher.connection.bind('connected', () => {
    console.log('Pusher connected:', pusher.connection.socket_id)
  })

  pusher.connection.bind('error', (error) => {
    console.error('Pusher connection error:', error)
  })

  const channelName = `private-room-${roomId}`

  return {
    pusher,
    channel: pusher.subscribe(channelName),
    channelName,
  }
}
