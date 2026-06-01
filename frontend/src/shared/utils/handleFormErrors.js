
export const handleFormErrors = (error, setFieldError) => {
  const errors = error?.response?.data?.errors

  if (errors && typeof errors === 'object') {
    Object.entries(errors).forEach(([field, messages]) => {
      const message = Array.isArray(messages) ? messages[0] : messages
      setFieldError(field, message)
    })
    return
  }

  return error?.response?.data?.message || error.message || 'Something went wrong'
}