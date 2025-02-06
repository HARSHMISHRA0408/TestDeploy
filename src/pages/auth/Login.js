import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

function Login() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false); // State to handle loading spinner

  //google auth sign in redirector
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
    <div
      className="flex items-center justify-center h-screen"
      style={{ backgroundColor: "#fdf5f3" }}
    >
      <div className="flex rounded-lg overflow-hidden shadow-lg bg-white w-4/5 h-[600px] p-7 relative">
        {/* Spinner Overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
            <div className="loader"></div>
          </div>
        )}

        <div className="flex items-center justify-center w-1/2  bg-white">
          <Image
            src="/login.svg"
            alt="Side Image"
            layout="responsive"
            width={200}
            height={200}
            className="object-contain p-1"
          />
        </div>
               {/* Right Side - Login Form */}
               <div className="flex flex-col items-center justify-center w-full md:w-1/2 space-y-6">
          
          {/* Company Logo */}
          <Image
            src="/Images/image.png"
            alt="Company Logo"
            width={120}
            height={120}
            className="text-center"
          />

          {/* Google Sign-In Button */}
          <button
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
            onClick={() => {
              setLoading(true);
              signIn("google");
            }}
          >
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#4285F4" d="M44.5 20H24v8.5h11.9C34.3 33.5 30 37 24 37c-6.9 0-12.5-5.6-12.5-12.5S17.1 12 24 12c3 0 5.7 1.1 7.8 3l5.8-5.8C33.7 5.5 29.1 3.5 24 3.5 12.3 3.5 3 12.8 3 24.5S12.3 45.5 24 45.5C35.7 45.5 44 36.2 44 24.5c0-1.5-.2-3-.5-4.5z"/>
              <path fill="#34A853" d="M6.5 14.1l6.5 4.8C14.9 16 19.1 13 24 13c3 0 5.7 1.1 7.8 3l5.8-5.8C33.7 5.5 29.1 3.5 24 3.5 17.1 3.5 11.2 7.6 8 13.5z"/>
              <path fill="#FBBC05" d="M24 45.5c6.5 0 12.2-2.2 16.7-6l-6.2-5c-2.5 1.8-5.8 3-9.5 3-5.9 0-11.3-3.8-13.5-9.1l-6.4 5C9.2 40 16 45.5 24 45.5z"/>
              <path fill="#EA4335" d="M44.5 20H24v8.5h11.9C34.3 33.5 30 37 24 37c-6.9 0-12.5-5.6-12.5-12.5S17.1 12 24 12c3 0 5.7 1.1 7.8 3l5.8-5.8C33.7 5.5 29.1 3.5 24 3.5 12.3 3.5 3 12.8 3 24.5S12.3 45.5 24 45.5C35.7 45.5 44 36.2 44 24.5c0-1.5-.2-3-.5-4.5z"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
      <style jsx>{`
        .loader {
          border: 4px solid #f3f3f3;
          border-radius: 50%;
          border-top: 4px solid #3498db;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default Login;
