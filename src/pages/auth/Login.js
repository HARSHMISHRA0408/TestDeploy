import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // State to handle loading spinner

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setLoading(true); // Show spinner during the API call

    try {
      const response = await fetch(`/api/userLogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const res = await response.json();
      if (res.success) {
        document.cookie = `token=${res.token}; path=/;`;
        const role = res.user.role;
        localStorage.setItem("token", res.token);
        localStorage.setItem("userEmail", email);

        // Redirect based on user role
        if (role === "admin") {
          router.push("/admin/Dashboard");
        } else if (role === "employee") {
          router.push("/candidate/Dashboard");
        } else if (role === "manager") {
          router.push("/manager/Dashboard");
        }
      } else {
        setError("Incorrect email or password.");
        alert("Fill Details Correctly");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false); // Hide spinner after the API call
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen"
      style={{ backgroundColor: "#fdf5f3" }}
    >
      <div className="flex rounded-lg overflow-hidden shadow-lg bg-white w-3/4 h-[600px] p-6 relative">
        {/* Spinner Overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
            <div className="loader"></div>
          </div>
        )}

        <div className="flex items-center justify-center w-1/2 bg-white">
          <Image
            src="/login.svg"
            alt="Company Logo"
            layout="responsive"
            width={200}
            height={200}
            className="object-contain p-4"
          />
        </div>
        <div className="flex items-center justify-center w-1/2 p-6">
          <form className="flex flex-col w-full" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
            {error && (
              <div className="mb-4 text-red-500 text-center">{error}</div>
            )}
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700">
                Password:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            
            <button
              type="submit"
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
              disabled={loading} // Disable button when loading
            >
              {loading ? "Loading..." : "Submit"}
            </button>
            <div className="mt-4 text-center">
              <p>
                Forgot Password?{" "}
                <Link
                  href="/auth/ForgotPassword"
                  className="text-blue-500 hover:underline"
                >
                  Reset Password
                </Link>
              </p>
            </div>
            <div className="mt-4 text-center">
              <p>
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/SignUp"
                  className="text-blue-500 hover:underline"
                >
                  Register here
                </Link>
              </p>
            </div>
          </form>
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
