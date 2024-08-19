import bcrypt from 'bcryptjs'
import { PrismaClient } from "@prisma/client"
import { sendVerificationEmail } from '@/helpers/sendEmailVerifications'

export async function POST(request) {
    const prisma = new PrismaClient()
    try {
        const { username, email, password, firstName, lastName, contactNumber } = await request.json()
        const existingVerifiedUserByUsername = await prisma.user.findUnique({
            where: {
                username,
                isVerified: true
            }
        })
        if (existingVerifiedUserByUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, {
                status: 400
            }
            );
        }

        const existingUserByEmail = await prisma.user.findUnique({
            where: {
                email
            }
        })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "Email is already taken"
                }, {
                    status: 400
                })
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1);

                const updatedUser = await prisma.user.update({
                    where: {
                        email
                    },
                    data: {
                        password: hashedPassword,
                        verifyCode,
                        verifyCodeExpiry: expiryDate
                    }
                })
            }

        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = await prisma.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                    verifyCode,
                    verifyCodeExpiry: expiryDate,
                    firstName,
                    lastName,
                    contactNumber,
                }
            })
        }

        // send verification email
        const emailResponse = await sendVerificationEmail({ username, email, verifyCode })
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {
                status: 500
            })
        }

        return Response.json({
            success: true,
            message: "User registered successfully. Please verify your email"
        }, {
            status: 201
        })

    }
    catch (error) {
        console.error("Error registering user", error)
        return Response.json({
            success: false,
            message: "Error registering user"
        }, {
            status: 500
        })
    }
}