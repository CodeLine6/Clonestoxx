import { sendVerificationEmail } from "@/helpers/sendEmailVerifications";

export async function POST(request) {

    const {username,email, verifyCode} = await request.json();

    try {
        const emailResponse = await sendVerificationEmail({ username, email, verifyCode})
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {
                status: 500
            })
        }

        return Response.json({
            success: true,
            message: "Verification code sent successfully"
        }, {
            status: 201
        })
    }

    catch (err) {

        return Response.json({
            success: false,
            message: err.message
        }, {
            status: 500
        })

    }
}