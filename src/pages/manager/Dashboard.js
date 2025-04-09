import Layout from "./Layout";
import Link from "next/link";
import React from "react";
import { getSession } from "next-auth/react";

const Dashboard = ({ user }) => {
  return (
    <Layout user={user}>
      <div className="max-h-screen flex flex-col items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full">
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 mb-3">
            <h2 className="text-2xl font-semibold text-blue-800 mb-6">
              Profile Information
            </h2>
            <table className="min-w-full bg-gray-50 rounded-lg overflow-hidden">
              <tbody>
                <tr>
                  <td className="px-6 py-4 text-gray-800 font-medium capitalize">
                    Name
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.name}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-800 font-medium capitalize">
                    Email
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-800 font-medium capitalize">
                    Role Title
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.role}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-800 font-medium capitalize">
                  Managing
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.manageKnowledgeArea.join(" || ")}</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Placeholder for dashboard features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/manager/users"
              className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-blue-500 transition duration-200"
            >
              <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-lg text-center">
                <h2 className="text-2xl font-semibold mb-2">Users</h2>
                <p>Manage user accounts and access levels.</p>
              </div>
            </Link>
            <Link
              href="/manager/Result"
              className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-green-500 transition duration-200"
            >
              <div className="p-6 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg shadow-lg text-center">
                <h2 className="text-2xl font-semibold mb-2">Results</h2>
                <p>View and analyze system reports.</p>
              </div>
            </Link>

            <Link
              href="/manager/Marks"
              className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-red-500 transition duration-200"
            >
              <div className="p-6 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg shadow-lg text-center">
                <h2 className="text-2xl font-semibold mb-2">Settings</h2>
                <p>Configure application settings and preferences.</p>
              </div>
            </Link>

          </div>

          <footer className="mt-12 text-gray-500 text-center">
            &copy; 2024 Viyal. All rights reserved.
          </footer>
        </div>
      </div>
    </Layout>
  );
};



// Protect the page with server-side authentication
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session || session.user.role !== "manager") {
    return {
      redirect: {
        destination: "/", // Replace with your sign-in page route
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

// // Apply the layout to the Dashboard page
// Dashboard.getLayout = function getLayout(page) {
//   return <Layout>{page}</Layout>;
// };

export default Dashboard;
