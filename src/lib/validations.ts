import * as z from 'zod'

export const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  budgetRange: z.enum(['<$1k', '$1k-$5k', '$5k-$20k', '$20k+']),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message is too long'),
})

export type LeadFormData = z.infer<typeof leadSchema>
