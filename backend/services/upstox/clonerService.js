import { getClonerById, updateCloner } from '../../data/cloners.js';
import { createUpstoxMasterAccount, createUpstoxChildAccounts } from '../../utils/upstox.js';


const clonerSessions = new Map();

export const getClonerService = () => {
    const startCloner = async (clonerId) => {
        const cloner = await getClonerById(clonerId)
        if(!cloner) return {success: false, message: 'Cloner not found'}

        const masterAccount = createUpstoxMasterAccount(cloner.masterAccount)
        const childAccounts = createUpstoxChildAccounts(cloner.childAccounts)
        const setAccessTokenPromises = [...childAccounts.map(account => account.setAccessToken()), masterAccount.setAccessToken()];
        await Promise.all(setAccessTokenPromises)
        const ws = await masterAccount.startListening(childAccounts)
        ws.on('close', async () => {
            await updateCloner(clonerId, { state: 'STOPPED' })
        })
        clonerSessions.set(clonerId, ws)
         updateCloner(clonerId, { state: 'RUNNING' })

        return { success: true }
    };

    const stopCloner = async (clonerId) => {
        if (!clonerSessions.has(clonerId)) return { success: false, message: 'Cloner not found' }
        
        const ws = clonerSessions.get(clonerId)
        clonerSessions.delete(clonerId)
        ws.close()
        return {success: true, clonerId}
    };

    return { startCloner, stopCloner };
};