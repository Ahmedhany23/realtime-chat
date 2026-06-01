<script setup>
import { useRouter } from 'vue-router'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { handleFormErrors } from '@/shared/utils/handleFormErrors'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { useAuth } from '../composables/useAuth'
import { registerSchema } from '../schema/auth.schema'

const router = useRouter()

const { register, loading } = useAuth()

const formSchema = toTypedSchema(registerSchema)

const form = useForm({
  validationSchema: formSchema,
})

const handleRegister = async (values) => {
  try {
    await register(values).then(() => {
      toast.success('Registration successful')
    })

    router.push('/login')
  } catch (error) {
    const message = handleFormErrors(error, form.setFieldError)
    if (message) toast.error(message)
  }
}

const onSubmit = form.handleSubmit(handleRegister)
</script>

<template>
  <Card class="w-full max-w-md">
    <CardContent class="p-6 space-y-6">
      <div class="space-y-2">
        <h1 class="text-2xl font-bold">Register</h1>

        <p class="text-sm text-muted-foreground">Enter your credentials</p>
      </div>

      <form class="space-y-4" @submit.prevent="onSubmit">
        <FormField v-slot="{ componentField }" name="username">
          <FormItem>
            <FormLabel>Username</FormLabel>

            <FormControl>
              <Input type="username" placeholder="Enter username" v-bind="componentField" />
            </FormControl>

            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>Email</FormLabel>

            <FormControl>
              <Input type="email" placeholder="Enter email" v-bind="componentField" />
            </FormControl>

            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel>Password</FormLabel>

            <FormControl>
              <Input type="password" placeholder="Enter password" v-bind="componentField" />
            </FormControl>

            <FormMessage />
          </FormItem>
        </FormField>

        <Button class="w-full" :disabled="loading">
          {{ loading ? 'Loading...' : 'Register' }}
        </Button>
      </form>

      <div class="text-center text-sm text-muted-foreground">
        Already have an account?

        <Button variant="link" class="p-0 h-auto ml-1" @click="router.push('/login')">
          Login
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
