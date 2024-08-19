"use server"
import { PrismaClient } from "@prisma/client"
import bcrypt from 'bcryptjs'


const resetPassword = async (userId,password) => {
    const prisma = new PrismaClient()
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if(!user) {
            return {
                success: false,
                message: "User not found"
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                password: hashedPassword
            }
        })

        return {
            success: true,
            message: "Password reset successful"
        }
    }
    catch(err) {
        console.error("Error resetting password", err.message)
        return {
            success: false,
            message: "Error resetting password. Please try again"
        }
    }
}

export default resetPassword    