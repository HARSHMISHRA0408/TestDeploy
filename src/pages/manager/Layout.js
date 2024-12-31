import Image from "next/image";
import Link from "next/link";
import Router from "next/router";
import React from "react";
import { parse } from "cookie";
import jwt from "jsonwebtoken";


// Server-side authentication to restrict access to admin users
export async function getServerSideProps({ req }) {
  const redirectToLogin = {
    redirect: {
      destination: "/auth/Login",
      permanent: false,
    },
  };

  try {
    // Parse cookies manually to ensure proper extraction
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.token;

    // Redirect if token is missing
    if (!token || token.trim() === "") {
      console.error("No token found in cookies");
      return redirectToLogin;
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the role is "manager"
    if (decoded.role !== "manager") {
      console.error(`Unauthorized role: ${decoded.role}`);
      return redirectToLogin;
    }

    // Token is valid, and role is "manager"
    return {
      props: {
        user: decoded, // Pass decoded user info if needed
      },
    };
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return redirectToLogin;
  }
}

const Layout = ({ children }) => {
  const handleLogout = () => {
    // Clear the JWT token from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");

    // Redirect to the login page or home page
    Router.push("/auth/Login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed w-64 h-full bg-blue-800 text-white flex flex-col p-5 shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/Images/admin.webp"
            alt="Admin Profile"
            width={120}
            height={120}
            className="rounded-full border-4 border-gray-300 shadow-lg"
          />
          <h1 className="text-lg font-bold mt-4">Admin Panel</h1>
        </div>
        <nav className="flex-1">
          <ul className="space-y-4">
            <li>
              <Link
                href="/manager/Result"
                className="flex items-center space-x-2 bg-blue-700 py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
              >
                <span>Result</span>
              </Link>
            </li>
            <li>
              <Link
                href="/manager/Questions/AllQuestions"
                className="flex items-center space-x-2 bg-blue-700 py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
              >
                <span>Questions</span>
              </Link>
            </li>
            <li>
              <Link
                href="/manager/users"
                className="flex items-center space-x-2 bg-blue-700 py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
              >
                <span>Users</span>
              </Link>
            </li>
            <li>
              <Link
                href="/manager/Questions/KnowledgeArea"
                className="flex items-center space-x-2 bg-blue-700 py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
              >
                <span>Knowledge Area</span>
              </Link>
            </li>
            <li>
              <Link
                href="/manager/feedback"
                className="flex items-center space-x-2 bg-blue-700 py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
              >
                <span>Feedbacks</span>
              </Link>
            </li>
            <li>
              <Link
                href="/manager/Marks"
                className="flex items-center space-x-2 bg-blue-700 py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
              >
                <span>Difficulty Level & Marks</span>
              </Link>
            </li>
            <li>
              <Link
                href="/manager/Requests"
                className="flex items-center space-x-2 bg-blue-700 py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
              >
                <span>Test Requests</span>
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-500 py-2 px-4 rounded-md hover:bg-red-600 transition duration-200 w-full text-left"
              >
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
        <footer className="mt-8 text-center text-sm text-gray-300">
          &copy; 2024 Admin Dashboard
        </footer>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 bg-white shadow-lg">
        <header className="bg-gray-100 p-6 shadow-md">
          <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
