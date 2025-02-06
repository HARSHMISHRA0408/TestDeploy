// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import dbConnect from "../../../utils/db";
// import User from "../../../models/UsersModel";

// export const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//   ],
//   callbacks: {
//     // Handle user sign-in
//     async signIn({ user }) {
//       try {
//         console.log("User attempting to sign in:", user);

//         // Connect to the database
//         await dbConnect();

//         // Check if the user exists
//         const existingUser = await User.findOne({ email: user.email });

//         if (!existingUser) {
//           // If user does not exist, create a new user with default properties
//           const newUser = new User({
//             name: user.name,
//             email: user.email,
//             image: user.image,
//             role: "employee", // Default role
//             knowledgeArea: "default", 
//             category: "general",
//             test: "not started",
//           });
//           await newUser.save();
//           console.log("New user created:", newUser);
//         } else {
//           console.log("Existing user found:", existingUser);
//         }

//         return true; // Allow sign-in
//       } catch (error) {
//         console.error("Error during sign-in:", error);
//         return false; // Prevent sign-in
//       }
//     },

//     // Add user data to JWT token
//     async jwt({ token, user }) {
//       if (user) {
//         try {
//           await dbConnect();
//           const dbUser = await User.findOne({ email: user.email });

//           if (dbUser) {
//             token.userId = dbUser._id.toString();
//             token.role = dbUser.role;
//             token.knowledgeArea = dbUser.knowledgeArea;
//             token.category = dbUser.category;
//             token.test = dbUser.test;
//           }
//         } catch (error) {
//           console.error("Error adding data to JWT:", error);
//         }
//       }

//       return token;
//     },

//     // Pass user data from token to session
//     async session({ session, token }) {
//       if (token) {
//         session.user = {
//           ...session.user,
//           userId: token.userId,
//           role: token.role,
//           knowledgeArea: token.knowledgeArea,
//           category: token.category,
//           test: token.test,
//         };
//       }

//       return session;
//     },
//   },

//   session: {
//     strategy: "jwt", // Use JWT-based sessions
//   },
// };

// export default NextAuth(authOptions);

// Updated NextAuth Configuration
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "../../../utils/db";
import User from "../../../models/UsersModel";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        await dbConnect();
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          const newUser = new User({
            name: user.name,
            email: user.email,
            image: user.image,
            role: "employee",
            knowledgeArea: "general wait for admin update",
            category: "general wait for admin update",
            test: "allowed",
          });
          await newUser.save();
        }
        return true;
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        try {
          await dbConnect();
          const dbUser = await User.findOne({ email: user.email });
          if (dbUser) {
            token = { ...token, ...dbUser.toObject() };
          }
        } catch (error) {
          console.error("Error adding data to JWT:", error);
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.expires = Date.now() + 3600000;
      session.user = { ...session.user, ...token };
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },
};

export default NextAuth(authOptions);