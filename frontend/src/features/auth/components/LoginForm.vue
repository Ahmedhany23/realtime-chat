<script setup>
import { useRouter } from 'vue-router'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { useAuth } from '../composables/useAuth'
import { loginSchema } from '../schema/auth.schema'
import { toast } from 'vue-sonner'
import { handleFormErrors } from '@/shared/utils/handleFormErrors'

const router = useRouter()

const { login, loading } = useAuth()

const formSchema = toTypedSchema(loginSchema)

const form = useForm({
  validationSchema: formSchema,
})

const handleLogin = async (values) => {
  try {
    await login(values).then(() => {
      toast.success('Login successful')
    })

    router.push('/')
  } catch (error) {
    const message = handleFormErrors(error, form.setFieldError)
    if (message) toast.error(message)
  }
}

const onSubmit = form.handleSubmit(handleLogin)

const fillDemoAccount = () => {
  form.setFieldValue('email', 'test@gmail.com')
  form.setFieldValue('password', '12345678')

  toast.success('Demo account filled')
}
const fillDemoOtherAccount = () => {
  form.setFieldValue('email', 'ahmedhany.22@hotmail.com')
  form.setFieldValue('password', '12345678')

  toast.success('Demo account filled')
}
</script>

<template>
  <Card class="w-full max-w-md">
    <CardContent class="p-6 space-y-6">
      <div class="space-y-2">
        <h1 class="text-2xl font-bold">Login</h1>

        <p class="text-sm text-muted-foreground">Enter your credentials</p>
      </div>

      <form class="space-y-4" @submit.prevent="onSubmit">
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
          {{ loading ? 'Loading...' : 'Login' }}
        </Button>
      </form>

      <div
        class="rounded-lg border border-dashed p-4 cursor-pointer hover:bg-muted/50 transition-colors"
        @click="fillDemoAccount"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Demo Account</p>
            <p class="text-sm text-muted-foreground">Click to fill login credentials</p>
          </div>

          <Button type="button" variant="secondary" size="sm"> Use Demo </Button>
        </div>

        <div class="mt-3 text-xs text-muted-foreground space-y-1">
          <p>Email: test@gmail.com</p>
          <p>Password: 12345678</p>
        </div>
      </div>
      <div
        class="rounded-lg border border-dashed p-4 cursor-pointer hover:bg-muted/50 transition-colors"
        @click="fillDemoOtherAccount"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Demo Account</p>
            <p class="text-sm text-muted-foreground">Click to fill login credentials</p>
          </div>

          <Button type="button" variant="secondary" size="sm"> Use Demo </Button>
        </div>

        <div class="mt-3 text-xs text-muted-foreground space-y-1">
          <p>Email: ahmedhany.22@hotmail.com</p>
          <p>Password: 12345678</p>
        </div>
      </div>

      <div class="text-center text-sm text-muted-foreground">
        Don't have an account?

        <Button variant="link" class="p-0 h-auto ml-1" @click="router.push('/register')">
          Register
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
