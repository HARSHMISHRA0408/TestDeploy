import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./Layout";
import { getSession } from "next-auth/react";



const PendingUsers = ({ user }) => {
  const [users, setUsers] = useState([]);

  // Fetch users with test status 'pending'
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/user");

        // Accessing the correct field that contains the array of users
        const pendingUsers = response.data.data.filter(
          (user) => user.test === "pending"
        );
        setUsers(pendingUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Handle approve/reject actions
  const handleAction = async (userEmail, action) => {
    try {
      const response = await axios.patch(
        `/api/approve-reject`,
        { email: userEmail, action } // Pass email and action ('allowed' or 'rejected')
      );

      if (response.data.success) {
        alert("Request updated successfully!");
        setUsers(users.filter((user) => user.email !== userEmail)); // Remove the approved/rejected user from the list
      } else {
        alert(response.data.message || "Failed to update test status.");
      }
    } catch (error) {
      console.error("Error updating user's test status:", error);
    }
  };

  return (
    <Layout user={user}>
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Pending Test Requests
        </h1>

        {users.length === 0 ? (
          <div className="flex justify-center items-center h-64 bg-gray-100 rounded-lg">
            <p className="text-lg text-gray-500">No pending users.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div
                key={user._id}
                className="flex flex-col justify-between bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow duration-300"
              >
                <div className="mb-4">
                  <p className="text-lg font-semibold text-gray-700">
                    {user.email}
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleAction(user.email, "allowed")}
                    className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-colors duration-300"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(user.email, "rejected")}
                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-colors duration-300"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};


// Protect the page with server-side authentication
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session || session.user.role !== "admin") {
    return {
      redirect: {
        destination: "/testAuth", // Replace with your sign-in page route
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

export default PendingUsers;
