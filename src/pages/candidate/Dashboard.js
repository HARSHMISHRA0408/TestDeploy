import React from "react";
import { getSession, signOut } from "next-auth/react";
import CandidateLayout from "./CandidateLayout";

const CandidateDashboard = ({ user }) => {
  return (
    <CandidateLayout user={user}>
      <div className="p-6 max-w-4xl mx-auto">

        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
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
                  Knowledge Area
                </td>
                <td className="px-6 py-4 text-gray-600">{user.knowledgeArea}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-gray-800 font-medium capitalize">
                  Category
                </td>
                <td className="px-6 py-4 text-gray-600">{user.category}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-gray-800 font-medium capitalize">
                  Registration Date
                </td>
                <td className="px-6 py-4 text-gray-600">{user.registrationDate}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </CandidateLayout>
  );
};

// Fetch session data
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session || session.user.role !== "employee") {
    return {
      redirect: {
        destination: "/", // Replace with your sign-in page route
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: session.user, // ✅ Ensure user is passed correctly
    },
  };
}

export default CandidateDashboard;
