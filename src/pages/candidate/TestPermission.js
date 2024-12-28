import { useState } from "react";
import Layout from "../candidate/CandidateLayout";

const RequestPermission = () => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [message, setMessage] = useState("");

  const handleRequestPermission = async () => {
    const email = localStorage.getItem("userEmail");
    const token = localStorage.getItem("token");

    if (!email || !token) {
      setMessage("Error: User not logged in.");
      return;
    }

    setIsRequesting(true);
    setMessage("");

    try {
      const response = await fetch("/api/testupdate", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, test: "pending" }),
      });

      const updateData = await response.json();

      if (updateData.success) {
        setMessage("Request submitted successfully! Please wait for admin approval.");
      } else {
        setMessage(updateData.message || "Failed to update test status.");
      }
    } catch (error) {
      console.error("Error updating user's test status:", error);
      setMessage("An error occurred. Please try again later.");
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Request Test Permission</h1>
      <p className="text-lg text-gray-600 mb-6 text-center">
        Your test access is currently restricted. Please request admin approval to proceed.
      </p>
      <button
        onClick={handleRequestPermission}
        disabled={isRequesting}
        className={`px-6 py-3 rounded-lg text-white font-semibold transition ${
          isRequesting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isRequesting ? "Requesting..." : "Request Permission"}
      </button>
      {message && (
        <p
          className={`mt-6 text-lg ${
            isRequesting ? "text-yellow-500" : "text-green-600"
          } text-center`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default RequestPermission;

// Apply the layout to the Quiz page
RequestPermission .getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
  };