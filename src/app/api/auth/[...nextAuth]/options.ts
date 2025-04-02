import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";

export const AuthOptions: NextAuthOptions = {
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        try {
            // we need to connect to db while performing opterations because we need to check if the user is verified or not and also establisha  connection to db as Next is a Edge TIme Framework
          await dbConnect();
          const user = await userModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!user) {
            throw new Error("User not found");
          }
          if (!user?.isVerified) {
            throw new Error("Please Verify Yourself first");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect password");
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks:{
    async session({ session, token }) {
        if(token){
            session.user._id = token._id;
            session.user.isVerified = token.isVerified;
            session.user.isAcceptingMessage = token.isAcceptingMessage;
            session.user.username = token.username 
        }
        return session
      },
      async jwt({ token, user }) {

        // Here we cannot take the user._id out brcause of typescript , we need to deplcare a new module inwhich we can modify the types for the data 

        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;


        return token
      }
  },
  pages:{
    signIn :  '/sign-in'
  },
  session:{
    strategy : 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
};
