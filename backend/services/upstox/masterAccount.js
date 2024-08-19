import { WebSocket } from "ws";
import UpstoxAccount from "./account.js";
import UpstoxClient from "upstox-js-sdk";

let apiVersion = "2.0";

class UpstoxMasterAccount extends UpstoxAccount {
  constructor(accountData) {
    super(accountData)
  }

  async setWsURL() {
    let defaultClient = UpstoxClient.ApiClient.instance;
    let OAUTH2 = defaultClient.authentications["OAUTH2"];
    OAUTH2.accessToken = this.accessToken
    this.wsUrl = await new Promise((resolve, reject) => {
      // Initialize a Websocket API instance
      let apiInstance = new UpstoxClient.WebsocketApi();

      // Request to get the portfolio stream feed authorization
      apiInstance.getPortfolioStreamFeedAuthorize(
        apiVersion,
        (error, data, response) => {
          if (error) {
            // If there's an error, log it and reject the promise
            reject(error);
          } else {
            // If no error, log the returned data and resolve the promise
            resolve(data.data.authorizedRedirectUri);
          }
        }
      );
    });
  }

  async connectToSocket(childAccounts) {
    let orderModified = false;
    return new Promise((resolve, reject) => {
      // Initialize a WebSocket instance with the authorized URL and appropriate headers
      const ws = new WebSocket(`${this.wsUrl}`, {
        headers: {
          "Api-Version": apiVersion,
          Authorization: `Bearer ${this.accessToken}`,
        },
        followRedirects: true,
      });

      const handlers = {
        'modified': () => { orderModified = true; },
        'put order req received': (parsedData) => {
          childAccounts.forEach((childAccount) => {
            childAccount.createOrder(parsedData);
          });
        },
        'cancelled': (parsedData) => {
          childAccounts.forEach((childAccount) => {
            childAccount.removeOrder(parsedData);
          });
        },
      };

      ws.on('message', (data) => {
        const parsedData = JSON.parse(data);

        if (orderModified) {
          childAccounts.forEach((childAccount) => {
            childAccount.modifyOrder(parsedData);
          });
          orderModified = false;
          return;
        }

        const handler = handlers[parsedData.status];
        if (handler) {
          handler(parsedData);
        }
      });

      ws.on('open', () => {
        console.log('connected');
        resolve(ws);
      });

      ws.on('close', () => {
        console.log('disconnected');
      });

      ws.on('error', (error) => {
        console.error('error:', error);
        reject(error);
      });


    });
  }

  async startListening(childAccounts) {
    await this.setWsURL()
    return await this.connectToSocket(childAccounts)
  }
}

export default UpstoxMasterAccount 