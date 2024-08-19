import UpstoxAccount from "./account.js";
import { placeOrder,cancelOrder,modifyOrder } from "./api.js"


class UpstoxChildAccount extends UpstoxAccount {

    ordersPlaced = {}
    constructor(accountData) {
        super(accountData)
        this.modifierPercentage = accountData.modifierPercentage
    }

    async createOrder(orderData) {
        const newOrderId =  await placeOrder(this.accessToken, this.modifierPercentage,orderData)
        this.ordersPlaced[orderData.order_id] = newOrderId
    }

    async removeOrder(orderData) {
        const orderId = this.ordersPlaced[orderData.order_id]
        if(!orderId) return
          await  cancelOrder(this.accessToken, orderId)
        delete this.ordersPlaced[orderData.order_id]
        
    }

    modifyOrder(orderData) {
        const orderId = this.ordersPlaced[orderData.order_id]
        if(!orderId) return
        modifyOrder(this.accessToken,this.modifierPercentage,orderId,orderData)
    }
}

export default UpstoxChildAccount