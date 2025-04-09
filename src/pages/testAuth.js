// import React, { useEffect, useState } from "react";
// import { signIn, signOut, useSession } from "next-auth/react";
// import { useRouter } from "next/router";

// const Dashboard = () => {
//   const { data: session, status } = useSession();
//   const [userData, setUserData] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     if (session) {
//       const user = session.user;
//       setUserData(user);

      
//       const role = user.role;
//         console.log("User attempting to sign in testauth page:", user);
//         console.log("User attempting to sign in:", role);
//       // Redirect based on role
      
//       if (role === "admin") {
//         router.push("/admin/Dashboard");
//       } else if (role === "employee") {
//         router.push("/candidate/Dashboard");
//       } else if (role === "manager") {
//         router.push("/api/questions/getQuestions");
//       }
//     }
//   }, [session, router]);

//   if (status === "loading") {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <p className="text-xl">Loading...</p>
//       </div>
//     );
//   }

//   if (!session) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen">
//         <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
//         <p className="mt-4">Please sign in to access your account details.</p>
//         <button
//           className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           onClick={() => signIn("google")}
//         >
//           Sign in with Google
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <h1 className="text-3xl font-bold">Welcome, {userData?.name}!</h1>
//       <div className="mt-6 bg-gray-100 p-6 rounded shadow-lg w-4/5 md:w-2/5">
//         <h2 className="text-xl font-bold mb-4">Session Details:</h2>
//         {userData && (
//           <ul className="text-left">
//             {Object.entries(userData).map(([key, value]) => (
//               <li key={key} className="mb-2">
//                 <span className="font-semibold">{key}:</span>{" "}
//                 {typeof value === "string" ? value : JSON.stringify(value)}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//       <button
//         className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//         onClick={() => signOut()}
//       >
//         Sign Out
//       </button>
//     </div>
//   );
// };

// export default Dashboard;

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const LoginPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  // Redirect to the appropriate dashboard if the user is logged in
  useEffect(() => {
    if (session) {
      const role = session.user.role; // Access user role from session
      if (role === "admin") {
        router.push("/admin/Dashboard");
      } else if (role === "employee") {
        router.push("/candidate/Dashboard");
      } else if (role === "manager") {
        router.push("/manager/Dashboard");
      }
    }
  }, [session, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-semibold mb-4">Welcome to Login Page</h1>
        <p className="text-gray-600 mb-6">Sign in to access your dashboard.</p>
        {/* Sign-in Button */}
        <button
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => signIn("google")}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
