import {z} from 'zod'

export const userNameValidation = z
    .string()
    .min(3, {message: 'Username must be at least 3 characters'})
    .max(20, {message: 'Username must be no more than 20 characters'})
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")

export const emailValidation = z.string().email({message: 'Please enter a valid email'})    

export const profileSchema = z.object({
    email : emailValidation,
    firstName: z.string().min(3, {message: 'First name must be at least 3 characters'}),
    lastName: z.string(),
    contactNumber: z.string().min(10, {message: 'Contact number must be at least 10 characters'}), 
})    

export const signUpSchema = profileSchema.extend({
    username : userNameValidation,
    password: z.string().min(6, {message: 'Password must be at least 6 characters'}),
    image: z.string().url({message: 'Please enter a valid image url'}).or(z.literal(''))
})