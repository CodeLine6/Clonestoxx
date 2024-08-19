import { PrismaClient } from "@prisma/client"

export async function POST(request) {
    const prisma = new PrismaClient()
    try {
        const { username, code } = await request.json()
        const user = await prisma.user.findUnique({
            where: {
                username
            }
        })
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 400
            })
        }
        if (user.verifyCode !== code) {
            return Response.json({
                success: false,
                message: "Invalid OTP"
            }, {
                status: 400
            })
        }

        if (user.verifyCodeExpiry < new Date()) {
            return Response.json({
                success: false,
                message: "OTP expired"
            }, {
                status: 400
            })
        }

        const updatedUser = await prisma.user.update({
            where: {
                username
            },
            data: {
                isVerified: true
            }
        })
        return Response.json({
            success: true,
            message: "Email verified successfully"
        }, {
            status: 200
        })
    }
    catch (error) {
        console.error("Error verifying email", error)
        return Response.json({
            success: false,
            message: "Error verifying email"
        }, {
            status: 500
        })
    }
}