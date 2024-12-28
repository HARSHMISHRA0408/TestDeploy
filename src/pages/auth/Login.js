import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/userLogin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const res = await response.json();
    if (res.success) {
      document.cookie = `token=${res.token}; path=/;`;
      const role = res.user.role;
      localStorage.setItem("token", res.token);
      localStorage.setItem("userEmail", email);
      // localStorage.setItem("KnowledgeArea", knowledgeArea);
      // localStorage.setItem("category", category);

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
  };

  return (
    <div
      className="flex items-center justify-center h-screen"
      style={{ backgroundColor: "#fdf5f3" }}
    >
      <div className="flex rounded-lg overflow-hidden shadow-lg bg-white w-3/4 h-[600px] p-6">
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
            >
              Submit
            </button>
            <div className="mt-4 text-center">
              <p>
                Don't have an account?{" "}
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
    </div>
  );
}

export default Login;
