// //check and divert user to significant page on clicking on quiz
// //allowed > quiz
// //not allowed > permission page

// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import React from 'react';
// import { getSession } from 'next-auth/react';


// const CheckTestPermission = ({ user }) => {
//   const router = useRouter();
//   const [test, setTest] = useState(null);
//   const userEmail = user.email;


//     // Fetch test permission and filter by user's email
//     useEffect(() => {
//       const fetchTestPermission = async () => {
//         if (!userEmail) return;

//         try {
//           const res = await fetch('/api/user');
//           const data = await res.json();

//           if (data.success) {
//             const TestPermission = data.data.filter((item) => item.test === userEmail);
//             setTest(TestPermission);
//             setFilteredResults(TestPermission);
//           } else {
//             setError('Failed to fetch results. Please try again later.');
//           }
//         } catch (err) {
//           setError('An error occurred while fetching results.');
//           console.error(err);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchTestPermission();
//     }, [userEmail]);

//   // const test = user.test;

//   useEffect(() => {

//     if (test) {
//       console.log(test);
//       if (test === "allowed") {
//         router.push("/quiz/Quiz"); // Redirect to the quiz if allowed
//       } if (test === "notallowed") {
//         router.push("/candidate/TestPermission"); // Redirect to the request permission page if not allowed
//       } if (test === "pending") {
//         router.push("/quiz/Quiz"); // Redirect to the request permission page if not allowed
//       } if (test === "rejected") {
//         router.push("/candidate/TestPermission"); // Redirect to the request permission page if not allowed
//       }
//     } else {
//       alert( "Failed to check test status.");
//       router.push("/");
//     }
//   })


//   return null; // Render nothing while waiting for the redirect
// };

// export default CheckTestPermission;

// // Protect the page with server-side authentication
// export async function getServerSideProps(context) {
//   const session = await getSession(context);

//   if (!session) {
//     return {
//       redirect: {
//         destination: '/testAuth', // Replace with your sign-in page route
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       user: session.user, // Pass user data to the component
//     },
//   };
// }


import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import React from 'react';
import { getSession } from 'next-auth/react';

const CheckTestPermission = ({ user }) => {
  const router = useRouter();
  const [test, setTest] = useState(null);
  const userEmail = user.email;

  useEffect(() => {
    const fetchTestPermission = async () => {
      if (!userEmail) return;

      try {
        const res = await fetch('/api/user');
        const data = await res.json();

        if (data.success) {
          const userData = data.data.find((item) => item.email === userEmail);
          if (userData) {
            setTest(userData.test); // Store the test status (allowed, notallowed, etc.)
          } else {
            setTest("notallowed"); // Default to "notallowed" if user is not found
          }
        } else {
          console.error("Failed to fetch results.");
        }
      } catch (err) {
        console.error("Error fetching test permission:", err);
      }
    };

    fetchTestPermission();
  }, [userEmail]);

  useEffect(() => {
    if (test !== null) {
      console.log("Test status:", test);

      switch (test) {
        case "allowed":
          router.push("/candidate/TestInstruction"); // Redirect to the quiz if allowed
          break;
        case "notallowed":
          router.push("/candidate/TestPermission"); // Redirect to the quiz if allowed
          break;
        case "rejected":
          router.push("/candidate/TestPermission");
          break;
        case "pending":
          router.push("/candidate/PendingRequest");
          break;
        default:
          alert("Unexpected test status.");
          router.push("/");
      }
    }
  }, [test, router]);

  return null; // Render nothing while redirecting
};

export default CheckTestPermission;

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
