<script setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { handleFormErrors } from '@/shared/utils/handleFormErrors'
import { toast } from 'vue-sonner'
import { useRooms } from '../composable/useRooms'
import { createRoomSchema } from '../schema/room.schema'

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
import { Plus } from '@lucide/vue'
import { ref } from 'vue'
import { Switch } from '@/components/ui/switch'

const { createRoom } = useRooms()

const createLoading = ref(false)

const form = useForm({
  validationSchema: toTypedSchema(createRoomSchema),
})

const open = ref(false)

const onSubmit = form.handleSubmit(async (values) => {
  createLoading.value = true
  try {
    await createRoom(values)
    toast.success('Room created')
    form.resetForm()
    open.value = false
  } catch (error) {
    const message = handleFormErrors(error, form.setFieldError)
    if (message) toast.error(message)
  } finally {
    createLoading.value = false
  }
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button variant="outline"> <Plus /> Create Room</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-106">
      <form class="space-y-4" @submit.prevent="onSubmit">
        <DialogHeader>
          <DialogTitle>Create Room</DialogTitle>
          <DialogDescription> Fill in the form to create a room </DialogDescription>
        </DialogHeader>

        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Room name</FormLabel>

            <FormControl>
              <Input placeholder="Enter Room name" v-bind="componentField" />
            </FormControl>

            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="description">
          <FormItem>
            <FormLabel>Description</FormLabel>

            <FormControl>
              <Input placeholder="Enter description" v-bind="componentField" />
            </FormControl>

            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ value, handleChange }" name="isPrivate">
          <FormItem>
            <FormLabel>Is private?</FormLabel>

            <FormControl>
              <Switch :model-value="value" @update:model-value="handleChange" />
            </FormControl>

            <FormMessage />
          </FormItem>
        </FormField>

        <DialogFooter>
          <DialogClose as-child>
            <Button variant="outline"> Cancel </Button>
          </DialogClose>
          <Button type="submit" :disabled="createLoading">
            {{ createLoading ? 'Creating...' : 'Create Room' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
