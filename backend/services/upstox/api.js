import puppeteer from 'puppeteer';
import axios from 'axios';
import { TOTP } from "totp-generator";
import { waitAndType } from '../../utils/puppeteer.js';
import { setTimeout } from 'timers/promises';


const BASE_URL = 'https://api.upstox.com/v2/'


export async function getAuthCode(upstoxAccount) {
    const { appId, redirect_uri, contactNumber, pin, totp } = upstoxAccount;
    const mobileSelector = "#mobileNum";
    const getOtpSelector = "#getOtp";
    const otpSelector = "#otpNum";
    const continueBtnSelector = "#continueBtn";
    const pinCodeSelector = "#pinCode";
    const pinContinueBtnSelector = "#pinContinueBtn";

    const endpoint = `${BASE_URL}login/authorization/dialog?client_id=${appId}&redirect_uri=${encodeURIComponent(redirect_uri)}`;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const ua =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36";
    await page.setUserAgent(ua);

    // Navigate the page to a URL
    await page.goto(endpoint, { waitUntil: 'networkidle0' });
    
    await page.screenshot({ path: `./screenshots/screenshot-${contactNumber}.png` });
    
    await waitAndType(page, mobileSelector, contactNumber);
    
    await page.click(getOtpSelector);
    
    await page.screenshot({ path: `./screenshots/screenshot-${contactNumber}-2.png` });
    
    const { otp } = TOTP.generate(totp)
    
    await waitAndType(page, otpSelector, otp);
    
    await page.click(continueBtnSelector);
    
    await page.screenshot({ path: `./screenshots/screenshot-${contactNumber}-3.png` });
    
    await waitAndType(page, pinCodeSelector, pin);
        
    const navigationPromise = page.waitForNavigation({timeout: 0});

    await page.click(pinContinueBtnSelector);
    await page.screenshot({ path: `./screenshots/screenshot-${contactNumber}-4.png` });
    
    await navigationPromise;
    await page.screenshot({ path: `./screenshots/screenshot-${contactNumber}-5.png` });  
    // wait for the page to load

    console.log(`Navigated to: ${page.url()}`);
    
    //get 'code' search param from currentURL
    const url = new URL(page.url());
    const code = url.searchParams.get('code');

    //close browser
    browser.close()

    return code
}

export async function generateAccessToken(upstoxAccount, authCode) {
    const { appId, appSecret, redirect_uri } = upstoxAccount;
    const endpoint = `${BASE_URL}login/authorization/token`;

    const headers = {
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    const data = {
        'code': authCode,
        'client_id': appId,
        'client_secret': appSecret,
        'redirect_uri': redirect_uri,
        'grant_type': 'authorization_code',
    };

    const response = await axios.post(endpoint, new URLSearchParams(data), { headers })
    if (response.status === 200) {
        return response.data.access_token
    }
    else {
        throw new Error("Error in generating access token")
    }
}

export async function placeOrder(accessToken, modifierPercentage,orderDetails) {

    const headers = {
        'accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
    };

    const data = {
        "quantity": Math.round(orderDetails.quantity * (modifierPercentage / 100)),
        "product": orderDetails.product,
        "validity": orderDetails.validity,
        "price": Math.round(orderDetails.price * (modifierPercentage / 100)),
        "tag": orderDetails.tag,
        "instrument_token": orderDetails["instrument_token"],
        "order_type": orderDetails.order_type,
        "transaction_type": orderDetails.transaction_type,
        "disclosed_quantity": orderDetails.disclosed_quantity,
        "trigger_price": orderDetails.trigger_price,
        "is_amo": orderDetails.is_amo
    }

    try {
        const response = await axios.post(`${BASE_URL}order/place`, data, { headers })
        if (response.status === 200) {
            return response.data.data.order_id
        }
        else {
            throw new Error("Error in placing order")
        }
    }
    catch (error) {
        throw new Error("Error in placing order")
    }
}

export async function cancelOrder(accessToken, orderId) {

    const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
    };

    try {
        const response = await axios.delete(`${BASE_URL}order/cancel?order_id=${orderId}`, { headers })
        if (response.status === 200) {
            return
        }
        else {
            throw new Error("Error in cancelling order")
        }
    }
    catch (error) {
        console.log(error)
    }
}

export async function modifyOrder(accessToken, modifierPercentage,orderId, orderData) {

    const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
    };

    const data = {
        "quantity": Math.round(orderData.quantity * (modifierPercentage / 100)),
        "validity": orderData.validity,
        "price": Math.round(orderData.price * (modifierPercentage / 100)),
        "order_id": orderId,
        "order_type": orderData.order_type,
        "disclosed_quantity": orderData.disclosed_quantity,
        "trigger_price": orderData.trigger_price,
    }

    try {
        const response = await axios.put(`${BASE_URL}order/modify`, data, { headers })
    }
    catch (error) {
        console.log(error)
    }
}