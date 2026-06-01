import { api } from '@/shared/lib/axios'

export const RoomService = {
  getRooms: async () => {
    const res = await api.get('/rooms')
    return res.data
  },

  getRoomById: async (id) => {
    const res = await api.get(`/rooms/${id}`)
    return res.data
  },

  getRoomMessages: async (id) => {
    const res = await api.get(`/rooms/${id}/messages`)
    return res.data
  },

  createRoom: async (data) => {
    const res = await api.post('/rooms', data)
    return res.data
  },

  deleteRoom: async (id) => {
    const res = await api.delete(`/rooms/${id}`)
    return res.data
  },
}
