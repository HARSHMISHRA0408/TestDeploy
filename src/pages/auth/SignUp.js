import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div
      className="flex items-center justify-center h-screen"
      style={{ backgroundColor: "#fdf5f3" }}
    >
      <div className="flex rounded-lg overflow-hidden shadow-lg bg-white w-3/4 h-[600px] p-6">
        {" "}
        {/* Adjusted width */}
        <div className="flex items-center justify-center w-1/2 bg-white">
          <Image
            src="/login.svg" // Update with the correct image path
            alt="Company Logo"
            layout="responsive" // Use responsive layout for scaling
            width={200} // Specify width for the image
            height={200} // Specify height for the image
            className="object-contain p-4" // Adjust object-fit property
          />
        </div>
        <div className="flex items-center justify-center w-1/2 p-6">
          {" "}
          {/* Centering the form */}
          <form className="flex flex-col w-full" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Register
            </h2>
            {error && (
              <div className="mb-4 text-red-500 text-center">{error}</div>
            )}
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700">
                Name:
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
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
              Register
            </button>
            <div className="mt-4 text-center">
              <p>
                Already have an account?{" "}
                <Link
                  href="/auth/Login"
                  className="text-blue-500 hover:underline"
                >
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
