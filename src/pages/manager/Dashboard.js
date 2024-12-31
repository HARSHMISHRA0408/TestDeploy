// // pages/admin/dashboard.js
// import Layout from './Layout';
// import jwt from "jsonwebtoken";

// // Server-side authentication to restrict access to admin users
// export async function getServerSideProps({ req }) {
//   const token = req.cookies.token;

//   // Redirect to login if token is missing
//   if (!token) {
//     return {
//       redirect: {
//         destination: "/auth/Login",
//         permanent: false,
//       },
//     };
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Check if the user is an admin
//     if (decoded.role !== "admin") {
//       return {
//         redirect: {
//           destination: "/auth/Login",
//           permanent: false,
//         },
//       };
//     }

//     // If the role is admin, allow access
//     return {
//       props: {}, // Pass props if needed
//     };
//   } catch (error) {
//     return {
//       redirect: {
//         destination: "/auth/Login",
//         permanent: false,
//       },
//     };
//   }
// }

// const Dashboard = () => {
//   return (
//     <div className="border-black p-4">
//       <h1>Viyal logo</h1>
//       <p>Welcome to the Admin Dashboard!</p>
//     </div>
//   );
// };

// // Apply the layout to the Dashboard page
// Dashboard.getLayout = function getLayout(page) {
//   return <Layout>{page}</Layout>;
// };

// export default Dashboard;
// pages/admin/dashboard.js
import Layout from './Layout';
import jwt from "jsonwebtoken";
import { parse } from "cookie";


// Server-side authentication to restrict access to admin users
// Server-side authentication to restrict access to admin users
export async function getServerSideProps({ req }) {
  const redirectToLogin = {
    redirect: {
      destination: "/auth/Login",
      permanent: false,
    },
  };

  try {
    // Parse cookies manually to ensure proper extraction
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.token;

    // Redirect if token is missing
    if (!token || token.trim() === "") {
      console.error("No token found in cookies");
      return redirectToLogin;
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the role is "manager"
    if (decoded.role !== "manager") {
      console.error(`Unauthorized role: ${decoded.role}`);
      return redirectToLogin;
    }

    // Token is valid, and role is "manager"
    return {
      props: {
        user: decoded, // Pass decoded user info if needed
      },
    };
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return redirectToLogin;
  }
}

const Dashboard = () => {
  return (
    <div className="max-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition">
            <p>Viyal</p>
          </div>
        </div>

        <p className="text-gray-600 mb-8 text-lg">
          Welcome to the Admin Dashboard! Here you can manage users, review reports, and handle administrative tasks.
        </p>

        {/* Placeholder for dashboard features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-semibold mb-2">Users</h2>
            <p>Manage user accounts and access levels.</p>
          </div>
          <div className="p-6 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-semibold mb-2">Reports</h2>
            <p>View and analyze system reports.</p>
          </div>
          <div className="p-6 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-semibold mb-2">Settings</h2>
            <p>Configure application settings and preferences.</p>
          </div>
        </div>

        <footer className="mt-12 text-gray-500 text-center">
          &copy; 2024 Viyal. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

// Apply the layout to the Dashboard page
Dashboard.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default Dashboard;
