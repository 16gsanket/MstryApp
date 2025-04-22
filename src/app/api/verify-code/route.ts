import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import {z} from 'zod';


export async function POST(request : Request){
    console.log('in the verify-code codebase')
    await dbConnect();

    try {
        const {username , code} = await request.json();

        const user = await userModel.findOne({username})

        if(!user){
            return Response.json({
                success:false,
                message : "User not Found !!"
            },{status : 400})
        }        
        
        const isCodeValid = user.verifycode === code;
        const isCodeNotExpired = new Date(user.verifycodeExpiry) > new Date();

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true;
            await user.save()
            return Response.json({
                success:true,
                message : "User Verified Successfully"
            },{status : 200})
        }else if(!isCodeNotExpired){
            return Response.json({
                success:false,
                message : "Verification Code has Expired, please sign Up Again to get the new code"
            },{status : 400})
        }else{
            return Response.json({
                success:false,
                message : "Verification Code entered is incorrect"
            },{status : 400})
        }

    }  catch (error) {
        console.error("Error in checking the User Code:", error);
        return Response.json({
            success:false,
            message : "Error in checking the User Code"
        },{status : 400})
    }   
}