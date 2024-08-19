import { PrismaClient } from "@prisma/client"

export async function POST(request, context) {
    const prisma = new PrismaClient()
    
    try {
        const {username} = context.params;
        const userExists = await prisma.user.findUnique({
            where: {
                username
            }
        })

        if(!userExists) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            })
        }
         
        const { email, contactNumber, firstName, lastName, image } = await request.json()
        const updatedUser = await prisma.user.update({
            where: {
                username
            },
            data: {
                email,
                contactNumber,
                firstName,
                lastName,
                image
            }
        })
        return Response.json({
            success: true,
            message: "Profile updated successfully"
        }, {
            status: 200
        })
    }
    catch (error) {
        console.error("Error updating profile", error)
        return Response.json({
            success: false,
            message: "Error updating profile"
        }, {
            status: 500
        })
    }
}