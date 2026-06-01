<script setup>
import { Skeleton } from '@/components/ui/skeleton'
import CreateRoomDialog from '@/features/room/components/CreateRoomDialog.vue'
import RoomCard from '@/features/room/components/RoomCard.vue'
import { useRooms } from '@/features/room/composable/useRooms'
import AppLayout from '@/layouts/AppLayout.vue'
import { onMounted } from 'vue'

const { rooms, fetchRooms, loading } = useRooms()

onMounted(() => fetchRooms())
</script>

<template>
  <AppLayout>
    <div class="container mx-auto py-8 px-4 space-y-6">
      <CreateRoomDialog />

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4" v-if="!loading">
        <RoomCard v-for="room in rooms" :key="room._id" :room="room" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4" v-else-if="loading">
        <Skeleton class="h-50" v-for="i in 3" :key="i" />
      </div>
    </div>
  </AppLayout>
</template>
