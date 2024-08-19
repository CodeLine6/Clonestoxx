"use server"
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import prisma from "@/lib/prisma";
import axios from "axios";
import { getServerSession } from "next-auth";

export async function upsertCloner(input) {
    const sessionData = await getServerSession(authOptions)
    
    const userId = sessionData.user._id

    const { id, name, masterAccountId, childAccounts } = input;
    try {
     const cloner = await prisma.$transaction(async (prisma) => {
        let cloner;
        
        if (id) {
            // Update existing Cloner
            cloner = await prisma.cloner.update({
                where: { id },
                data: {
                    name,
                    masterAccountId,
                    userId
                },
            });
        } else {
            // Create new Cloner
            cloner = await prisma.cloner.create({
                data: {
                    name,
                    masterAccountId,
                    state: "STOPPED",
                    userId
                },
            });
        }

        // If updating, remove any child accounts that are no longer present
        if (id) {
            await prisma.childAccount.deleteMany({
                where: {
                    clonerId: cloner.id,
                },
            });
        }

        // Handle child accounts
        const childAccountPromises = childAccounts.map(async (childAccount) => {
            // Create new child account
            return prisma.childAccount.create({
                data: {
                    clonerId: cloner.id,
                    accountId: childAccount.accountId,
                    modifierPercentage: childAccount.modifierPercentage,
                },
            });
        });

        await Promise.all(childAccountPromises);

        // Fetch and return the updated cloner with all its associations
        return await prisma.cloner.findUnique({
            where: { id: cloner.id },
            include: {
                masterAccount: true,
                childAccounts: {
                    include: { account: true },
                },
            },
        });
    });

    if (cloner) {
        return {
            success: true,
            cloner
        };
    }
    }

    catch (err) {
        console.error("Error upserting cloner", err.message)
        return {
            success: false,
            message: err.message
        }
    }
}

export async function getCloners() {
    const sessionData = await getServerSession(authOptions)
    
    const userId = sessionData.user._id
    try {
        const cloners = await prisma.cloner.findMany({
            where : {
                userId
            },
            include: {
                masterAccount: true,
                childAccounts: true,
            },
        });

        if (!cloners) {
            return {
                success: false,
                message: "Cloners not found"
            }
        }

        return {
            success: true,
            cloners
        }
    }
    catch (e) {
        console.error("Error getting cloners", e.message)
        return {
            success: false,
            message: e.message
        }
    }
}

export async function getClonerInfo(clonerId) {
    try {
        const cloner = await prisma.cloner.findUnique({
            where: { id: clonerId },
            include: {
                childAccounts: {
                    select : {
                        accountId: true,
                        modifierPercentage: true
                    }
                }
            },
        });

        if (!cloner) {
            return {
                success: false,
                message: "Cloner not found"
            }
        }
        return {
            success: true,
            cloner
        };

    } catch (err) {
        console.error("Error getting cloner info", err.message)
        return {
            success: false,
            message: err.message
        }
    }
}

export async function startCloner(clonerId) {
    try {
        const startRequest = await axios.get(`${process.env.CLONESTOXX_BACKEND}/cloners/start/${clonerId}`, {
            timeout: 200000
        })
        return {
            success: startRequest.data.success
        }
    }
    catch(e) {
        console.error("Error starting cloner", e.message)
        return {
            success: false,
            message: e.message
        }
    }
}

export async function stopCloner(clonerId) {
    try {   
        const stopRequest = await axios.get(`${process.env.CLONESTOXX_BACKEND}/cloners/stop/${clonerId}`)
        return {
            success: stopRequest.data.success
        }
    }
    catch(e) {
        return {
            success: false,
            message: e.message
        }
    }
}

export async function deleteCloner(clonerId) {
    try {
        const deletedCloner = await prisma.$transaction(async (prisma) => {
            const deletedCloner = await prisma.cloner.delete({
                where: { id: clonerId },
            })
        
        if(deletedCloner) {
            await prisma.childAccount.deleteMany({
                where: {
                    clonerId,
                },
            });
        }

            return deletedCloner
        })
        
        if (!deletedCloner) {
            return {
                success: false,
                message: "Cloner not found"
            }
        }
        return {
            success: true,
        }
    }
    catch (e) {
        console.error("Error deleting cloner", e.message)
        return {
            success: false,
            message: e.message
        }
    }
}