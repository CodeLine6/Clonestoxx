import {z} from 'zod'

export const forgetPasswordSchema = z.object({
    email: z.string().email({message: 'Please enter a valid email'})
})