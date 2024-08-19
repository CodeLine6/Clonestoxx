import { getAuthCode,generateAccessToken} from "./api.js"

class UpstoxAccount {

    redirect_uri = 'https://account.upstox.com/'

    constructor({appId,appSecret,contactNumber,pin,totp}) {
        this.appId = appId
        this.appSecret = appSecret
        this.contactNumber = contactNumber.toString()
        this.pin = pin.toString()
        this.totp = totp
    }

    async setAccessToken() {
        const authCode = await getAuthCode(this)
        this.accessToken = await generateAccessToken(this, authCode)
    }

}

export default UpstoxAccount