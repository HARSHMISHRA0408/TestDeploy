import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { getSession } from "next-auth/react";
import CandidateLayout from "./CandidateLayout";
import Quiz from "../quiz/Quiz"; // Ensure correct path

export default function FetchTests({ user }) {
  const [tests, setTests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState(null); // Tracks selected test
  const [userId, setuserId] = useState(null);
  //const [testId , settestId] = useState(null);

  useEffect(() => {
    setuserId(user._id);
    const fetchTests = async () => {
      try {
        const response = await axios.get(`/api/tests/testGet?userId=${user._id}`);
        setTests(response.data.tests);
        console.log(tests);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching tests");
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchTests();
    }
  }, [user?._id]);

  const UpdateTestStatus = (testId) => {
    try {
      // Update the user's 'test' status to 'notallowed'
      fetch("/api/tests/testUpdate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is stored and retrieved
        },
        body: JSON.stringify({ userId, testId, permission: "pending" }),
      })
        .then((response) => response.json())
        .then((updateData) => {
          if (updateData.success) {
            alert("User's test status updated to 'notallowed'.");
          } else {
            alert(
              updateData.message || "Failed to update user's test status."
            );
          }
        })


    } catch (error) {
      alert("Error updating user's test status: " + error.message)
    }
  }

  return (
    <CandidateLayout user={user}>
      <div className="max-w-lg mx-auto p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-4">Available Tests</h2>

        {loading && <p className="mt-2 text-gray-500">Loading...</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}

        {!selectedTest ? (
          tests.length > 0 ? (
            <ul className="list-none space-y-2">
              {tests.map((test, index) => (
                <li key={index} className="p-2 border-b flex justify-between items-center">
                  <span>
                    <strong>{test.name}</strong> - {test.category} ({test.knowledgeArea})
                  </span>
                  {test.permission === "allowed" && (  // Corrected this part
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={() => setSelectedTest(test)}
                    >
                      Start Quiz
                    </button>
                  )}

                  {test.permission === "notallowed" && (  // Corrected this part
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={() => UpdateTestStatus(test._id)}
                    >
                      Request Retest
                    </button>
                  )}

                  {test.permission === "rejected" && (  // Corrected this part
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      //onClick={() => UpdateTestStatus(test._id)}
                    >
                      Rejected
                    </button>
                  )}

                  {test.permission === "pending" && (  // Corrected this part
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    // onClick={() => UpdateTestStatus(test._id)}
                    >
                      Pending for approval
                    </button>
                  )}
                </li>
              ))}
            </ul>

          ) : (
            !loading && <p className="text-gray-500">No tests available</p>
          )
        ) : (
          <Quiz
            user={user}
            knowledgeAreaPara={selectedTest.knowledgeArea}
            categoryPara={selectedTest.category}
            testId={selectedTest._id}
          />
        )}
      </div>
    </CandidateLayout>
  );
}

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
      user: session.user, // ✅ Ensures user is passed correctly
    },
  };
}
