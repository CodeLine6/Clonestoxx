import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getClonerById = async (id) => {

    const cloner = await prisma.cloner.findUnique({
        where: {
            id
        },
        select : {
            id:true,
            name:true,
            state: true,
            childAccounts: {
                select: {
                    account: {
                        select : {
                            appId: true,
                            appSecret: true,
                            contactNumber: true,
                            pin: true,
                            totp: true
                        }
                    },
                    modifierPercentage: true
                }
            },
            masterAccount: {
                select : {
                    appId: true,
                    appSecret: true,
                    contactNumber: true,
                    pin: true,
                    totp: true
                }
            }
        }
    })
    return cloner
}

export const updateCloner = async (id, data) => {
    const cloner = await prisma.cloner.update({
        where: {
            id
        },
        data
    })
}