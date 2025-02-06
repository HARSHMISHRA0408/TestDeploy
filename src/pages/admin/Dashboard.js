import Layout from './Layout';
import React from "react";
import { getSession, signOut } from "next-auth/react";


const Dashboard = ({ user }) => {
  return (
    <Layout user={user}>
      <div className="max-h-screen flex flex-col items-center justify-center mt-4 ">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <div className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition">
              <p>{user.email}</p>
            </div>
          </div>

          <p className="text-gray-600 mb-8 text-lg">
            Welcome to the Admin Dashboard! Here you can manage users, review reports, and handle administrative tasks.
          </p>

          {/* Placeholder for dashboard features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">

            <button
              onClick={() => window.location.href = "/admin/users"}
              className="p-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-lg text-center transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <h2 className="text-2xl font-semibold mb-2">Users</h2>
              <p>Manage user accounts and access levels.</p>
            </button>

            <button
              onClick={() => window.location.href = "/admin/Result"}
              className="p-6 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg shadow-lg text-center transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <h2 className="text-2xl font-semibold mb-2">Result's</h2>
              <p>Test result.</p>
            </button>

            <button
              onClick={() => window.location.href = "/admin/Requests"}
              className="p-6 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg shadow-lg text-center transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <h2 className="text-2xl font-semibold mb-2">Test Request's</h2>
              <p>Manage user test requests.</p>
            </button>


          </div>

          <footer className="mt-12 text-gray-500 text-center">
            &copy; 2024 Viyal. All rights reserved.
          </footer>
        </div>
      </div>
    </Layout>
  );
};

// Apply the layout to the Dashboard page
// Dashboard.getLayout = function getLayout(page) {
//   return <Layout>{page}</Layout>;
// };



export default Dashboard;

// Protect the page with server-side authentication
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session || session.user.role !== "admin") {
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
