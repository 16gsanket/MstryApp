import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { getServerSession, User } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";

export async function GET(request: Request) {
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

  //   here we need to convert the plain string userId into the objectID of mongoose becuase in the aggregate pipelines, we cannot just use the string id but we need to use the object id of mongoose
  try {
    const user = await userModel.aggregate([
      { $match: { id: userID } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user) {
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
        message: "User  found",
        messages: user[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error in getting the messages", error);
    return Response.json(
      {
        success: false,
        message: "unexpected error in getting messages",
      },
      { status: 404 }
    );
  }
}
