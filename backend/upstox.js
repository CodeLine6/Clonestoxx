import UpstoxChildAccount from "./services/upstox/childAccount.js";
import UpstoxMasterAccount from "./services/upstox/masterAccount.js";

const masterAccount = new UpstoxMasterAccount({
    appId:"8710d463-1e68-4d9c-a9f1-258d3e1c5833",
    appSecret:"t96kuoqjhs",
    contactNumber:"9650653684",
    pin:"121004",
    totp:"TH2254LDPPPDNZUAHJGJ7I5GTRF5QYK4"
})
const account = new UpstoxChildAccount({
    appId:"582f331b-dd31-4d0a-b411-1b3c5e1766f9",
    appSecret:"cc5080x4c0",
    contactNumber:"8178087670",
    pin:"153415",
    totp:"PIT5XTPNVXQKDFMADGJZ3MNTTQW74D4G"
})

const childAccounts = [account];
const setAccessTokenPromises = childAccounts.map(account => account.setAccessToken());
setAccessTokenPromises.push(masterAccount.setAccessToken());

Promise.all(setAccessTokenPromises).then(async (res) =>{
   const ws = await masterAccount.startListening([account])
   
})
