"use server"
import { authOptions } from "@/app/api/auth/[...nextauth]/option"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"

export const getTradeAccounts = async () => {
    const sessionData = await getServerSession(authOptions)
    
    const userId = sessionData.user._id
    const prisma = new PrismaClient()
    try {
        const tradeAccounts = await prisma.tradeAccount.findMany({
            where: {
                userId
            },
            include: {
                childCloners: {
                    select: {
                        cloner : {
                            select: {
                                state: true
                            }
                        }
                    }
                },
                masterCloners : {
                    select: {
                        state: true
                    }
                }
            }
        })  

        if(!tradeAccounts) {
            return {
                success: false,
                message: "Trade Accounts not found"
            }
        }

        return {
            success: true,
            tradeAccounts
        }
    }
    catch(err) {    
        console.error("Error fetching trade accounts", err.message)
        return {
            success: false,
            message: "Error fetching trade accounts. Please try again"
        }
    }
}

export const getTradeAccountInfo = async (accountId) => {

    const prisma = new PrismaClient()
    try {
        const tradeAccount = await prisma.tradeAccount.findUnique({
            where: {
                id: accountId
            },
            select: {
                title:true,
                appId:true,
                appSecret:true,
                accountUserId:true,
                contactNumber:true,
                pin:true,
                totp:true,
            }
        })

        if(!tradeAccount) {
            return {
                success: false,
                message: "404: Trade Account not found"
            }
        }

        return {
            success: true,
            tradeAccount
        }
    }
    catch(err) {
        console.error("Error fetching trade account", err)
        if(err.code === "P2023") {
            return {
                success: false,
                message: "404: Trade Account not found"
            }
        }
        return {
            success: false,
            message: err.message
        }
    }
}

export const createTradeAccount = async (data) => {
    const sessionData = await getServerSession(authOptions)
    
    const userId = sessionData.user._id
    const prisma = new PrismaClient()
    try {
        const tradeAccount = await prisma.tradeAccount.create({
            data: {
                title: data.title || '',
                appId: data.appId,
                appSecret: data.appSecret,
                accountUserId: data.accountUserId,
                contactNumber: data.contactNumber, // Convert to string as per schema
                pin: data.pin, // Convert to string as per schema
                totp: data.totp,
                userId: userId,
            }
        })
        return {
            success: true,
            tradeAccount
        }
    }
    catch(err) {
        console.error("Error creating trade account", err.message)
        return {
            success: false,
            message: err.message
        }
    }
}

export const updateTradeAccount = async (data) => {
    const prisma = new PrismaClient()
    try {
        const tradeAccount = await prisma.tradeAccount.update({
            where: {
                id: data.id
            },
            data: {
                title: data.title || '',
                appId: data.appId,
                appSecret: data.appSecret,
                accountUserId: data.accountUserId,
                contactNumber: data.contactNumber, // Convert to string as per schema
                pin: data.pin, // Convert to string as per schema
                totp: data.totp
            }
        })
        return {
            success: true,
            tradeAccount
        }
    }
    catch(err) {
        console.error("Error updating trade account", err.message)
        return {
            success: false,
            message: err.message
        }
    }
}

export const deleteTradeAccount = async (accountId) => {
    const prisma = new PrismaClient()
    try {
        await prisma.tradeAccount.delete({
            where: {
                id: accountId
            }
        })
        return {
            success: true
        }
    }
    catch(err) {
        console.error("Error deleting trade account", err.message)
        return {
            success: false,
            message: err.message
        }
    }
}   