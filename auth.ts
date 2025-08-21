import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verifyUser } from "./lib/firebase/controllers/userControllers";
import Google from "next-auth/providers/google";

export const { auth, handlers } = NextAuth({
    providers:[
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),

        Credentials({
            async authorize(credentials){
              const {email, password} = credentials as {
                  email: string;
                  password: string;
              };

              const user = await verifyUser(email, password);
              if(!user) throw new Error("Something went wrong.");
              
              return {
                name: user.name,
                email: user.email
              };
            }
        }),
    ],

    session:{
        strategy: 'jwt',
        maxAge: 60*60 // 1 hour
    },

    callbacks: {
      async jwt({ token, user }) {
        const now = Math.floor(Date.now() / 1000);
        const expiryTime = token.exp || 0;

        // Add user data on first login
        if (user) {
          token.name = user.name;
          token.email = user.email;
        }

        // Sliding expiry
        if (expiryTime - now < 15 * 60) {
          token.exp = now + 60 * 60;
        }
        
        return token;
      },
    }
});