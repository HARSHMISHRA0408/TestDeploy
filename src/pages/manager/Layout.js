import Image from "next/image";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React from "react";

const Layout = ({ children }) => {
  const handleLogout = () => {
    // Clear the JWT token from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");

    // Optionally, clear any other user-related data

    // Redirect to the login page or home page
    Router.push("/auth/Login"); // Adjust the path as necessary
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed w-64 h-full bg-blue-900 text-white p-5">
        <nav>
          <ul className="space-y-4">
            <li>
              <Image
                src="/Images/admin.webp" // Path to your image file
                alt="An example image"
                width={200} // Set image width
                height={200} // Set image height
                className="rounded-full border-2 border-gray-300 p-5"
              />
            </li>
            <li>
              <Link
                href="/manager/Result"
                className="block w-full bg-blue-700 py-2 px-4 rounded hover:bg-blue-600 text-left"
              >
                Result
              </Link>
            </li>
            <li>
              <Link
                href="/manager/Questions/AllQuestions"
                className="block w-full bg-blue-700 py-2 px-4 rounded hover:bg-blue-600 text-left"
              >
                Question's
              </Link>
            </li>
            <li>
              <Link
                href="/manager/users"
                className="block w-full bg-blue-700 py-2 px-4 rounded hover:bg-blue-600 text-left"
              >
                Users
              </Link>
            </li>
            <li>
              <Link
                href="/manager/Questions/KnowledgeArea"
                className="block w-full bg-blue-700 py-2 px-4 rounded hover:bg-blue-600 text-left"
              >
                Knowledge Area
              </Link>
            </li>
            <li>
              <Link
                href="/manager/feedback"
                className="block w-full bg-blue-700 py-2 px-4 rounded hover:bg-blue-600 text-left"
              >
                Feedbacks
              </Link>
            </li>
            <li>
              <Link
                href="/manager/Marks"
                className="block w-full bg-blue-700 py-2 px-4 rounded hover:bg-blue-600 text-left"
              >
                Difficulty Level, Time & Marks
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="block w-full bg-blue-700 py-2 px-4 rounded hover:bg-blue-600 text-left"
              >
                Test Request's
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="p-2 block w-full bg-red-500 text-white rounded hover:bg-red-600 transition duration-200 "
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 ml-64 p-6">
        <header className="bg-gray-100 p-4 shadow-md mb-4">
          <h2 className="text-xl font-semibold">Manager Dashboard</h2>
        </header>

        <main className="overflow-auto">
          {children} {/* Render the page content here */}
        </main>
      </div>
    </div>
  );
};

export default Layout;
