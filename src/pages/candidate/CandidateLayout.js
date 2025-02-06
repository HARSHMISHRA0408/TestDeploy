// import Link from "next/link";
// // import React, { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import Image from "next/image";
// import { getSession, signOut } from "next-auth/react";

// const CandidateLayout = ({ children , user }) => {

//   const router = useRouter();



//   // Sidebar links configuration
//   const menuItems = [
//     { href: "/candidate/Dashboard", label: "👥 Dashboard" },
//     { href: "/candidate/UserResult", label: "📝 Result" },
//     { href: "#", label: "⚙️ Settings" },
//     { href: "/candidate/TestRoute", label: "✅ Take Test" },
//   ];

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-72 bg-blue-800 text-white flex flex-col">
//         <div className="flex flex-col items-center py-8">
//           <Image
//             src="{ user?.image || /Images/candi.webp}"
//             alt="Profile Picture"
//             width={120}
//             height={120}
//             className="rounded-full border-4 border-white shadow-lg"
//           />
//           <h3 className="mt-4 text-xl font-semibold"></h3>
//           <p className="text-sm text-blue-300">Employee Dashboard</p>
//         </div>
//         <nav className="flex-1 mt-8">
//           <ul className="space-y-4">
//             {menuItems.map((item, index) => (
//               <li key={index}>
//                 <Link
//                   href={item.href}
//                   className="block w-2/3 mx-auto px-6 py-3 bg-blue-700 rounded-lg hover:bg-blue-600 text-left transition"
//                 >
//                   {item.label}
//                 </Link>
//               </li>
//             ))}
//             <li>
//               <button
//                 onClick={() => signOut()}
//                 className="block w-2/3 mx-auto px-6 py-3 bg-red-600 rounded-lg hover:bg-red-500 text-left transition text-white"
//               >
//                 🚪 Logout
//               </button>
//             </li>
//           </ul>
//         </nav>
//       </aside>

//       {/* Main content area */}
//       <div className="flex-1 flex flex-col">
//         <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
//           <h2 className="text-2xl font-bold text-gray-800">Candidate Dashboard</h2>
//           <button
//             onClick={() => signOut()}
//             className="text-red-500 text-sm hover:underline"
//           >
//             Logout
//           </button>
//         </header>
//         <main className="p-6 flex-1 bg-white shadow-md rounded-lg">{children}</main>
//       </div>
//     </div>
//   );
// };

// // Protect the page with server-side authentication
// export async function getServerSideProps(context) {
//   const session = await getSession(context);

//   if (!session || session.user.role !== "employee") {
//     return {
//       redirect: {
//         destination: "/testAuth", // Replace with your sign-in page route
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       user: session.user, // Pass user data to the component
//     },
//   };
// }


// export default CandidateLayout;
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { signOut } from "next-auth/react";

const CandidateLayout = ({ children, user }) => {
  const router = useRouter();

  // Sidebar links configuration
  const menuItems = [
    { href: "/candidate/Dashboard", label: "👥 Dashboard" },
    { href: "/candidate/UserResult", label: "📝 Result" },
    { href: "/candidate/TestRoute", label: "✅ Take Test" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-blue-800 text-white flex flex-col">
        <div className="flex flex-col items-center py-8">
          <Link href="/candidate/Dashboard">
            <Image
              src={user?.image || "/Images/candi.webp"} // Use user image or default
              alt="Profile Picture"
              width={120}
              height={120}
              className="rounded-full border-4 border-white shadow-lg"
            />
          </Link>
          <h3 className="mt-4 text-xl font-semibold">{user?.name || "User"}</h3>
          <p className="text-sm text-blue-300">Employee Dashboard</p>
        </div>
        <nav className="flex-1 mt-8">
          <ul className="space-y-4">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="block w-2/3 mx-auto px-6 py-3 bg-blue-700 rounded-lg hover:bg-blue-600 text-left transition"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={() => signOut()}
                className="block w-2/3 mx-auto px-6 py-3 bg-red-600 rounded-lg hover:bg-red-500 text-left transition text-white"
              >
                🚪 Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Welcome {user.name}!</h2>

        </header>
        <main className="p-6 flex-1 bg-white shadow-md rounded-lg">{children}</main>
      </div>
    </div>
  );
};

export default CandidateLayout;
