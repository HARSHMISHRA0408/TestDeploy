import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

const CandidateLayout = ({ children }) => {
  const [userEmail, setUserEmail] = useState("Guest");
  const router = useRouter();

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    router.push("/auth/Login");
  };

  useEffect(() => {
    const email = localStorage.getItem("userEmail") || "Guest";
    setUserEmail(email);
  }, []);

  // Sidebar links configuration
  const menuItems = [
    { href: "/candidate/Dashboard", label: "👥 Dashboard" },
    { href: "/candidate/UserResult", label: "📝 Result" },
    { href: "#", label: "⚙️ Settings" },
    { href: "/candidate/TestRoute", label: "✅ Take Test" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-blue-800 text-white flex flex-col">
        <div className="flex flex-col items-center py-8">
          <Image
            src="/Images/candi.webp"
            alt="Profile Picture"
            width={120}
            height={120}
            className="rounded-full border-4 border-white shadow-lg"
          />
          <h3 className="mt-4 text-xl font-semibold">{userEmail}</h3>
          <p className="text-sm text-blue-300">Data Science | Beginner</p>
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
                onClick={handleLogout}
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
          <h2 className="text-2xl font-bold text-gray-800">Candidate Dashboard</h2>
          <button
            onClick={handleLogout}
            className="text-red-500 text-sm hover:underline"
          >
            Logout
          </button>
        </header>
        <main className="p-6 flex-1 bg-white shadow-md rounded-lg">{children}</main>
      </div>
    </div>
  );
};

export default CandidateLayout;
