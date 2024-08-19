import { z } from 'zod'

export const clonerSchema = z.object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
    masterAccountId: z.string(),
    childAccounts: z.array(
        z.object({
            accountId: z.string(),
            modifierPercentage: z.number().min(1).max(100)
        })
    ).min(1, { message: "At least one child account is required." }),
})