import { useState } from "react";
import React from 'react';
import { getSession } from 'next-auth/react';
import Layout from "../candidate/CandidateLayout";

const RequestPermission = ({user}) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [message, setMessage] = useState("");
  const email = user.email;

  const handleRequestPermission = async () => {
    

    setIsRequesting(true);
    setMessage("");

    try {
      const response = await fetch("/api/testupdate", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          
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
    <Layout user={user}>  
    <div className="flex flex-col items-center justify-center h-full">
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
    </Layout>
  );
};

export default RequestPermission;

// Protect the page with server-side authentication
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session || session.user.role !== "employee") {
    return {
      redirect: {
        destination: '/testAuth', // Replace with your sign-in page route
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

// // Apply the layout to the Quiz page
// RequestPermission .getLayout = function getLayout(page) {
//     return <Layout>{page}</Layout>;
//   };