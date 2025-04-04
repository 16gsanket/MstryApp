import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
) : Promise<ApiResponse> {
    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mstry-Message | Verification Code',
            react:VerificationEmail({username , otp : verifyCode}) 
          });

        return {success:true , message : "send verification email" }
    } catch (emailError) {
        console.log('Error sending verification email', emailError);
        return {success:false , message : "Error sending verification email" }
    }
}
