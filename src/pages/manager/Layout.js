import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Router from "next/router";
import React, { useState } from "react";
import { getSession } from "next-auth/react";

const Layout = ({ children , user }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true); // Sidebar open state

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed h-full bg-blue-800 text-white flex flex-col p-5 shadow-lg transition-all duration-300 ${isSidebarOpen ? "w-64 left-0" : "-left-64"
          }`}
      >
        <div className="flex flex-col items-center mb-8">
          <Image
            src={ user?.image || "/Images/admin.webp"}
            alt="Admin Profile"
            width={120}
            height={120}
            className="rounded-full border-4 border-gray-300 shadow-lg cursor-pointer"
            unoptimized
            onClick={() => Router.push("/manager/Dashboard")}
          />
          <h1 className="text-lg font-bold mt-4">Manager</h1>
        </div>

        <nav className="flex-1">
          <ul className="space-y-4">
            {[
              { name: "Result", path: "/manager/Result" },
              { name: "Questions", path: "/manager/Questions/AllQuestions" },
              { name: "Users", path: "/manager/users" },
              { name: "Feedbacks", path: "/manager/feedback" },
              { name: "Difficulty Level & Marks", path: "/manager/Marks" },
              { name: "Test Requests", path: "/manager/Requests" },
            ].map((item) => (
              <li key={item.name}>
                <Link
                  href={item.path}
                  className="flex items-center space-x-2 bg-blue-700 py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                >
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <button
          onClick={() => signOut()}
          className="w-full bg-red-500 py-2 px-4 rounded-md hover:bg-red-600 transition duration-200 mt-4"
        >
          Logout
        </button>

        <footer className="mt-8 text-center text-sm text-gray-300">
          &copy; 2024 Manager Dashboard
        </footer>
      </aside>

      {/* Open Sidebar Button (only visible when sidebar is closed) */}
      {!isSidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-5 left-5 bg-blue-800 text-white p-3 rounded-full shadow-lg ml-5 hover:bg-blue-700 transition"
        >
          ☰
        </button>
      )}

      {/* Close Sidebar Button (inside the sidebar) */}
      {isSidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-5 left-5 bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition text-white"
        >
          ✖
        </button>
      )}

      {/* Main Content Area */}
      <div className={`flex-1 ${isSidebarOpen ? "ml-64" : "ml-0"} bg-white shadow-lg transition-all duration-300`}>
        <header className="bg-gray-100 p-6 shadow-md flex justify-center items-center">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

// Protect the page with server-side authentication
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session || session.user.role !== "manager") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: session.user,
    },
  };
}

export default Layout;
