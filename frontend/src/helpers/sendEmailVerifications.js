import { resend } from "@/lib/resend";
import VerificationEmail from "../emails/VerificationEmail";

export async function sendVerificationEmail({username,email,verifyCode}) {
    try{
        const sendEmail = await resend.emails.send({
            from: "verify@clonestoxx.instantmarket.ing",
            to: email,
            subject: "Clonestoxx | Verify Email",
            react: VerificationEmail({username, otp: verifyCode}),
        })
        if(!sendEmail.data) {
            return {success: false,message: sendEmail.error.message}
        }
        return {success: true, message: "Verification email sent successfully"}
    }
    catch(err){
        console.error("Error sending verification email", err)
        return {success: false,message: "Error sending verification email"}
    }
}