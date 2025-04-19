import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { getServerSession, User } from "next-auth";
import { AuthOptions } from "../auth/[...nextAuth]/options";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(AuthOptions);

  const user = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "User is not logged in",
      },
      { status: 401 }
    );
  }

  const userID = user?._id;
  const { AcceptingMessages } = await request.json();

  try {
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: userID },
      { isAcceptingMessage: AcceptingMessages },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "isAcceptingMessage field updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error in toggling the isAcceptingMessage field ", error);
    return Response.json(
      {
        success: false,
        message: "Error in toggling the isAcceptingMessage field",
      },
      { status: 501 }
    );
  }
}

export async function GET(request:Request){
    await dbConnect();

    const session = await getServerSession(AuthOptions);
    const user = session?.user;
    
    if(!session || !session.user){
        return Response.json(
            {
              success: false,
              message: "User is not logged in",
            },
            { status: 401 }
        );
    }
    
    const userID = user?._id;
    try {
        const user = await userModel.findById(userID);

        if(!user){
            return Response.json(
                {
                  success: false,
                  message: "User not found",
                },
                { status: 404 }
              );
        }
        return Response.json(
            {
              success: true,
              message: "isAcceptingMessage field status sent successfully",
              isAcceptingMessage : user.isAcceptingMessage
            },
            { status: 200 }
          );
        
    } catch (error) {
        console.log("error in getting the isAcceptingMessage status ", error);
        return Response.json(
          {
            success: false,
            message: "error in getting the isAcceptingMessage status",
          },
          { status: 501 }
        );
    }
}
