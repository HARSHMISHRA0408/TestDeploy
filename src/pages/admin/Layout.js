import Image from "next/image";
import Link from "next/link";
import Router from "next/router";
import React, { useState } from "react";
import { getSession, signOut } from "next-auth/react";



const Layout = ({ children, user }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true); // Sidebar open state

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed h-full bg-blue-700 text-white flex flex-col p-5 shadow-lg transition-all duration-300 ${isSidebarOpen ? "w-64 left-0" : "-left-64"
          }`}
      >
        <div className="flex flex-col items-center mb-8">
          <Image
            src={user?.image || "/Images/admin.webp"}
            alt="Admin Profile"
            width={120}
            height={120}
            className="rounded-full border-4 border-gray-300 shadow-lg"
            onClick={() => Router.push("/admin/Dashboard")}
          />
          <h1 className="text-lg font-bold mt-4">Admin Panel</h1>
        </div>
        <nav className="flex-1">
          <ul className="space-y-4">
            {/* User & Manager Management */}
            <li>
              <Link
                href="/admin/users"
                className="flex items-center space-x-2 bg-blue-500 py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
              >
                <span>👤 Users</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/manager"
                className="flex items-center space-x-2 bg-blue-500 py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
              >
                <span>🧑‍💼 Managers</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/feedback"
                className="flex items-center space-x-2 bg-blue-500 py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
              >
                <span>💬 Feedbacks</span>
              </Link>
            </li>

            {/* Test & Question Management */}
            <li>
              <Link
                href="/admin/ManageTest"
                className="flex items-center space-x-2 bg-blue-500 py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
              >
                <span>📝 Tests</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/Questions/AllQuestions"
                className="flex items-center space-x-2 bg-blue-500 py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
              >
                <span>❓ Questions</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/Questions/KnowledgeArea"
                className="flex items-center space-x-2 bg-blue-500 py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
              >
                <span>📚 Knowledge Area</span>
              </Link>
            </li>

            {/* Results & Marks Handling */}
            <li>
              <Link
                href="/admin/Result"
                className="flex items-center space-x-2 bg-blue-500 py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
              >
                <span>🏆 Results</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/Marks"
                className="flex items-center space-x-2 bg-blue-500 py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
              >
                <span>📊 Difficulty & Marks</span>
              </Link>
            </li>

            {/* Logout at the End */}
            <li>
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-2 bg-red-500 py-2 px-4 rounded-md hover:bg-red-600 transition duration-200 w-full text-left"
              >
                <span>🚪 Logout</span>
              </button>
            </li>
          </ul>

        </nav>
        <footer className="mt-8 text-center text-sm text-gray-300">
          &copy; 2024 Admin Dashboard
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
          className="fixed top-5 left-5 bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition text-white"
        >
          ✖
        </button>
      )}

      {/* Main Content Area */}
      <div className={`flex-1 ${isSidebarOpen ? "ml-64" : "ml-0"} bg-white shadow-lg transition-all duration-300`}>
        <header className="bg-gray-100 p-6 shadow-md flex justify-center items-center">
          <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

// Protect the page with server-side authentication
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session || session.user.role !== "admin") {
    return {
      redirect: {
        destination: "/", // Replace with your sign-in page route
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: session.user, // Pass user data to the component
    },
  };
}


export default Layout;
