import { defineStore } from 'pinia'
import { RoomService } from '../services/room.service'

export const useRoomStore = defineStore('room', {
  state: () => ({
    rooms: [],
    currentRoom: null,
    messages: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchRooms() {
      this.loading = true
      try {
        this.rooms = await RoomService.getRooms()
      } catch (error) {
        console.error(error)
        this.error = error
      } finally {
        this.loading = false
      }
    },

    async fetchRoomById(id) {
      this.loading = true
      try {
        this.currentRoom = await RoomService.getRoomById(id)
        return this.currentRoom
      } catch (error) {
        console.error(error)
        this.error = error
      } finally {
        this.loading = false
      }
    },

    async fetchRoomMessages(id) {
      this.loading = true
      try {
        const msgs = await RoomService.getRoomMessages(id)
        // Reverse them so they are in chronological order (oldest to newest)
        this.messages = [...msgs].reverse()
        return this.messages
      } catch (error) {
        console.error(error)
        this.error = error
      } finally {
        this.loading = false
      }
    },

    addMessage(message) {
      // Prevent duplicates if we get them
      if (!this.messages.some((m) => m._id === message._id)) {
        this.messages.push(message)
      }
    },

    async createRoom(data) {
      try {
        const room = await RoomService.createRoom(data)
        this.rooms.push(room)
      } catch (error) {
        console.error(error)
      }
    },

    async deleteRoom(id) {
      try {
        await RoomService.deleteRoom(id)
        this.rooms = this.rooms.filter((room) => room._id !== id)
        if (this.currentRoom?._id === id) {
          this.currentRoom = null
          this.messages = []
        }
      } catch (error) {
        console.error(error)
      }
    },
  },
})
