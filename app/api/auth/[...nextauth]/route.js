import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          await dbConnect();
          
          // Check if user exists
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            // Create new user
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              provider: "google",
            });
          }
          return true;
        } catch (error) {
          console.error("Error saving user to DB:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session }) {
        // Attach extra user info if needed, e.g., db ID
        try {
            await dbConnect();
            const dbUser = await User.findOne({ email: session.user.email });
            if (dbUser) {
                session.user.id = dbUser._id.toString();
                session.user.progress = dbUser.progress || {};
            }
        } catch (error) {
            console.error(error);
        }
        return session;
    }
  },
  pages: {
    signIn: '/auth/signin', // Optional: Custom signin page if we wanted
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
