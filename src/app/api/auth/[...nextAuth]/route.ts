import NextAuth from "next-auth";
import { AuthOptions } from "../[...nextauth]/options";

const handler  = NextAuth(AuthOptions);

export { handler as GET, handler as POST };