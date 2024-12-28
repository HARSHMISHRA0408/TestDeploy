import Layout from "./Layout";
import jwt from "jsonwebtoken";

// Server-side authentication to restrict access to manager users
export async function getServerSideProps({ req }) {
  const token = req.cookies.token;

  // Redirect to login if token is missing
  if (!token) {
    return {
      redirect: {
        destination: "/auth/Login",
        permanent: false,
      },
    };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user is a manager
    if (decoded.role !== "manager") {
      return {
        redirect: {
          destination: "/auth/Login",
          permanent: false,
        },
      };
    }

    // Pass decoded data as props to the component
    return {
      props: {
        decoded,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/auth/Login",
        permanent: false,
      },
    };
  }
}

const Dashboard = ({ decoded }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Call UI */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo Section */}
          <div className="text-xl font-bold">Viyal</div>
          {/* Navigation Links */}
          <nav className="flex space-x-6">
            <a href="#overview" className="hover:text-gray-200">
              Overview
            </a>
            <a href="#team" className="hover:text-gray-200">
              Team
            </a>
            <a href="#settings" className="hover:text-gray-200">
              Settings
            </a>
          </nav>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-semibold mb-4">Manager Dashboard</h1>
          <div className="text-gray-700">
            <p className="mb-2">
              <span className="font-bold">Welcome:</span> {decoded.username}
            </p>
            <p className="mb-2">
              <span className="font-bold">Role:</span> {decoded.role}
            </p>
            <p className="mb-2">
              <span className="font-bold">Email:</span> {decoded.email}
            </p>
            <p className="mb-2">
              <span className="font-bold">Knowledge Area:</span>{" "}
              {decoded.knowledgeArea}
            </p>
            <p className="mb-2">
              <span className="font-bold">Category:</span> {decoded.category}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

// Apply the layout to the Dashboard page
Dashboard.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default Dashboard;
