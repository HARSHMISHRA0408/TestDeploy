import React, { useState } from "react";
import Router from "next/router";
import { ClipLoader } from "react-spinners"; // Import spinner from react-spinners

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const response = await fetch("/api/auth/resetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setError("");
        Router.push("/auth/Login");
      } else {
        setError(data.error);
        setMessage("");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {loading && (
        <div className="flex justify-center items-center h-64">
          <ClipLoader size={50} color="#3498db" loading={loading} />
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg"
      >
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Reset Password
        </h1>
        {message && (
          <p className="text-sm text-green-600 bg-green-100 p-2 rounded mb-4">
            {message}
          </p>
        )}
        {error && (
          <p className="text-sm text-red-600 bg-red-100 p-2 rounded mb-4">
            {error}
          </p>
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="w-full p-3 mb-4 text-gray-700 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          required
          className="w-full p-3 mb-4 text-gray-700 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
          required
          className="w-full p-3 mb-4 text-gray-700 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
