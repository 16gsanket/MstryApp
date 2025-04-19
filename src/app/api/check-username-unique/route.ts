import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import {z} from 'zod';
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
    username : usernameValidation
})

export async function GET(request : Request){
    await dbConnect();

    try {
      const {searchParams} = new URL(request.url);

      const queryParam = {
        username:searchParams.get('username')
      } 
    //   validate with zod
    const result = usernameQuerySchema.safeParse(queryParam);
    console.log('result from zod validation ', result)

    if(!result.success){
        const usernameError = result.error.format().username?._errors || []
        return Response.json({
            success:false,
            message : usernameError?.length > 0 ? usernameError[0] : "Invalid queery Parameter",
        },{status:400})
    }
    const{username} = result.data;

    const existingVerifiedUser = await userModel.findOne({
        username , isVerified : true
    })

    if(existingVerifiedUser){
        return Response.json({
            success:false,
            message : "username is already taken",
        },{status:400})
    }
    return Response.json({
        success:true,
        message : "username is unique",
    },{status:200})


        
    } catch (error) {
        console.error("Error checking username uniqueness:", error);
        return Response.json({
            success:false,
            message : "Error in checking username uniqueness"
        },{status : 500})
    }   
}
