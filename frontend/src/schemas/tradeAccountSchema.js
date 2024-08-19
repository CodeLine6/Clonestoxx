import {z} from 'zod'

const appIdRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const tradeAccountSchema = z.object({
  title: z.string().optional(),
  appId: z.string().regex(appIdRegex, "Invalid app ID format"),
  appSecret: z.string().length(10, "App secret must be exactly 10 characters long"),
  accountUserId: z.string().min(1, "Account user ID is required"),
  contactNumber: z.number().int().gte(1000000000).lte(9999999999, "Contact number must be a 10-digit number"),
  pin: z.number().int().gte(100000).lte(999999, "PIN must be a 6-digit number"),
  totp: z.string().length(32, "TOTP must be exactly 32 characters long")
});