import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
    console.log(username , email , password)

    const existingUserwithVerifiedUsername = await userModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserwithVerifiedUsername) {
      return Response.json(
        {
          success: false,
          message: "username is already registered",
        },
        { status: 400 }
      );
    }

    const existingUserWithEmail = await userModel.findOne({ email });

    const verifycode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserWithEmail) {

        if(existingUserWithEmail.isVerified){
            return Response.json(
                {
                    success: false,
                    message: 'user already exists with this email',
                },{status:500}
            )
        }else{
            const hashedPassword =await bcrypt.hash(password, 10);
            existingUserWithEmail.password = hashedPassword;
            existingUserWithEmail.verifycode = verifycode;
            existingUserWithEmail.verifycodeExpiry = new Date(Date.now() + 3600000);

            await existingUserWithEmail.save();
        }
      return;


    } else {
      const hashedPassword =await bcrypt.hash(password, 10);

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new userModel({
        username,
        email,
        password: hashedPassword,
        verifycode,
        verifycodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(email, username, verifycode);
    console.log(emailResponse)

    if(!emailResponse.success){
        return Response.json(
            {
                success: false,
                message: emailResponse.message,
            },{status:500}
        )
    }

    return Response.json(
        {
            success: true,
            message:"user registered successfully. Please verify your email",
        },{status:200}
    )


  } catch (error) {
    console.log("Error in registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error in registering user",
      },
      {
        status: 500,
      }
    );
  }
}
