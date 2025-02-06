import React from 'react';
import { getSession } from 'next-auth/react';
import Layout from "../candidate/CandidateLayout";

const RequestPermission = ({user}) => {
  
  const email = user.email;


  return (
    <Layout user={user}>
    <div className="flex flex-col items-center justify-center min-h-screen">
    <h1 className="text-2xl font-bold mb-4 text-gray-800"> {user.name} your test request currently pending </h1>
      {/* <h1 className="text-2xl font-bold mb-4 text-gray-800">Request Test Permission</h1> */}
      <p className="text-lg text-gray-600 mb-6 text-center">
        Your test access is currently restricted. Wait for admin or manager approval.
      </p>
    </div>
    </Layout>
  );
};

export default RequestPermission;

// Protect the page with server-side authentication
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
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