<script setup>
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DeleteModalButton from '@/shared/components/DeleteModalButton.vue'
import { useRooms } from '../composable/useRooms'
import { useRouter } from 'vue-router'

const props = defineProps({
  room: {
    type: Object,
    required: true,
  },
})

const router = useRouter()
const { deleteRoom, loading } = useRooms()

const goToRoom = () => router.push(`/rooms/${props.room._id}`)
</script>

<template>
  <Card class="hover:shadow-md transition cursor-pointer">
    <CardContent class="p-4 space-y-3">
      <!-- Header -->
      <div class="flex items-start justify-between">
        <div>
          <h2 class="text-lg font-semibold">
            {{ room.name }}
          </h2>

          <p class="text-sm text-muted-foreground line-clamp-2">
            {{ room.description || 'No description' }}
          </p>
        </div>

        <Badge :variant="room.isPrivate ? 'secondary' : 'default'">
          {{ room.isPrivate ? 'Private' : 'Public' }}
        </Badge>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between">
        <span class="text-xs text-muted-foreground">
          {{ new Date(room.createdAt).toLocaleDateString() }}
        </span>

        <CardFooter>
          <div class="flex gap-2 items-center">
            <Button @click.stop="goToRoom">View</Button>

            <DeleteModalButton
              heading="Are you sure you want to delete this room?"
              :delete-action="
                () => {
                  return deleteRoom(room._id)
                }
              "
              @click.stop
            />
          </div>
        </CardFooter>
      </div>
    </CardContent>
  </Card>
</template>

