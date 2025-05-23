import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();

    const {username , content} = await request.json();

    try {
        const user = await userModel.findOne({username});

        if(!user){
            return Response.json({
                success:false,
                message : "User not Found !!"
            },{status : 404})
        }

        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                message : "User not accepting messages !!"
            },{status : 403})
        }

        const newMessage = {content , createdAt:new Date()} 
        user.messages.push(newMessage as Message) 
        await user.save();

        return Response.json({
            success:true,
            message : "Message Sent Successfully !!"
          
        },{status : 200})

    } catch (error) {
        console.log("error in sending messages", error);
        return Response.json(
            {
              success: false,
              message: "unexpected error in sending messages",
            },
            { status: 404 }
          );
    }
}
