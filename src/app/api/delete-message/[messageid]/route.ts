import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth/next";
import { AuthOptions } from "../../auth/[...nextauth]/options";
import userModel from "@/model/User";

export async function Delete(request: Request, { params }: any) {
  await dbConnect();
  const messageId = params.messageid;
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
  try {
    const updatedResult = await userModel.updateOne({
      _id: user?._id,
    },{
        $pull : {message : {_id : messageId}}
    })

    if(updatedResult.modifiedCount === 0){
        
        return Response.json({
            success : false,
            message : "Message not found !!"
        },{status : 404})
    }

    return Response.json({
        success : true,
        message : "Message deleted successfully !!",
        data : updatedResult
    })
  } catch (error) {
    return Response.json({
        success : false,
        message : "Something went wrong !!",
        error
    })
  }
}
