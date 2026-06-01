import { useRoomStore } from "../stores/room.store";
import { computed } from "vue";

export const useRooms = () => {
  const store = useRoomStore();

  const rooms = computed(() => store.rooms);
  const currentRoom = computed(() => store.currentRoom);
  const messages = computed(() => store.messages);
  const loading = computed(() => store.loading);
  const error = computed(() => store.error);

  return {
    rooms,
    currentRoom,
    messages,
    loading,
    error,
    fetchRooms: store.fetchRooms,
    fetchRoomById: store.fetchRoomById,
    fetchRoomMessages: store.fetchRoomMessages,
    addMessage: store.addMessage,
    createRoom: store.createRoom,
    deleteRoom: store.deleteRoom,
  };
};