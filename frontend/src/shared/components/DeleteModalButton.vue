<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Trash } from '@lucide/vue'

const props = defineProps({
  heading: {
    type: String,
    required: true,
  },
  deleteAction: {
    type: Function,
    required: true,
  },
})

const deleteLoading = ref(false)
const open = ref(false)

const handleDelete = async () => {
  deleteLoading.value = true
  try {
    await props.deleteAction()
    open.value = false
  } catch (error) {
    console.log(error)
  } finally {
    deleteLoading.value = false
  }
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button variant="destructive" class="flex gap-1"><Trash /> Delete</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ heading }}</DialogTitle>
        <DialogDescription>This action cannot be undone.</DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <div class="flex gap-2 justify-end w-full">
          <DialogClose as-child>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button :disabled="deleteLoading" variant="destructive" @click="handleDelete">
            {{ deleteLoading ? 'Deleting...' : 'Delete' }}
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
