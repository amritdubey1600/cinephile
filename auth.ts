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
              
              // CRITICAL: Must include 'id' field for credentials provider
              return {
                id: user.id || user.email, // Use user.id if available, fallback to email
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
      async jwt({ token, user, account }) {
        const now = Math.floor(Date.now() / 1000);
        const expiryTime = token.exp || 0;

        // Add user data on first login
        if (user) {
          token.id = user.id; // IMPORTANT: Include user ID
          token.name = user.name;
          token.email = user.email;
        }

        // Include provider information
        if (account) {
          token.provider = account.provider;
        }

        // Sliding expiry
        if (expiryTime - now < 15 * 60) {
          token.exp = now + 60 * 60;
        }
        
        return token;
      },

      // Add session callback to pass user data to client
      async session({ session, token }) {
        if (token) {
          session.user.id = token.id as string;
          session.user.name = token.name as string;
          session.user.email = token.email as string;
        }
        return session;
      }
    },

    // Add these for better production compatibility
    trustHost: true,
    secret: process.env.AUTH_SECRET,
    
    // Optional: Add debug for development
    debug: process.env.NODE_ENV === 'development'
});