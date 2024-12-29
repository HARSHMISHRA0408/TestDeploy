// Import dependencies
import jwt from "jsonwebtoken";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "./CandidateLayout";

// Server-side authentication for access restriction
export async function getServerSideProps({ req }) {
  const token = req.cookies.token; // Retrieve token from cookies

  if (!token) {
    // Redirect if no token exists
    return {
      redirect: {
        destination: "/auth/Login",
        permanent: false,
      },
    };
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "employee") {
      // Redirect if the role is not "employee"
      return {
        redirect: {
          destination: "/auth/Login",
          permanent: false,
        },
      };
    }

    // Allow access if role is valid
    return {
      props: {}, // Pass props if needed
    };
  } catch (error) {
    // Redirect if token verification fails
    return {
      redirect: {
        destination: "/auth/Login",
        permanent: false,
      },
    };
  }
}

const Dashboard = () => {
  const [tokenData, setTokenData] = useState(null); // State to hold decoded token data
  const router = useRouter(); // Next.js router for navigation

  useEffect(() => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage

    if (!token) {
      alert("No token found. Redirecting to login.");
      router.push("/auth/Login"); // Redirect if no token exists
      return;
    }

    try {
      // Decode the token's payload
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setTokenData(decodedToken);

      if (decodedToken.role !== "employee") {
        alert("No access to this page.");
        router.push("/auth/Login"); // Redirect if role is invalid
      }
    } catch (error) {
      console.error("Failed to decode token:", error);
      alert("Invalid token. Redirecting to login.");
      router.push("/auth/Login"); // Redirect if decoding fails
    }
  }, [router]);

  return (
    <div className="p-8 bg-gray-100 max-h-screen">
      <main>
        {tokenData ? (
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-blue-800 mb-6">
              Profile Information
            </h2>
            <table className="min-w-full bg-gray-50 rounded-lg overflow-hidden">
              <tbody>
                {Object.entries(tokenData).map(([key, value], index) => (
                  <tr
                    key={key}
                    className={`${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    } hover:bg-gray-200`}
                  >
                    <td className="px-6 py-4 text-gray-800 font-medium capitalize">
                      {key}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {typeof value === "string" ? value : JSON.stringify(value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">No Data Found</h2>
            <p>Please log in to view your profile information.</p>
          </div>
        )}
      </main>
    </div>
  );
};

// Apply layout to the Dashboard page
Dashboard.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default Dashboard;
