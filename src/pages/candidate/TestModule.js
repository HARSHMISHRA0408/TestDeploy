import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { getSession } from "next-auth/react";
import CandidateLayout from "./CandidateLayout";
import Quiz from "../quiz/Quiz"; // Ensure correct path
import Link from "next/link";

export default function FetchTests({ user }) {
  const [tests, setTests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState(null); // Tracks selected test
  //const [userId, setuserId] = useState(null);
  //const [testId , settestId] = useState(null);

  useEffect(() => {
    if (user?._id) {
      fetchTests();
    }
  }, [user?._id]);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/tests/testGet?userId=${user._id}`);
      setTests(response.data.tests);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching tests");
    } finally {
      setLoading(false);
    }
  };

  const UpdateTestStatus = (testId) => {
    try {
      // Update the user's 'test' status to 'notallowed'
      fetch("/api/tests/testUpdate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is stored and retrieved
        },
        body: JSON.stringify({ userId : user._id , testId, permission: "pending" }),
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
    <div user={user} className="bg-custom w-100% h-screen justify-center pt-16 ">
      <div className="w-3/4  mx-auto p-4 bg-white shadow-lg rounded-lg ">
        <div className="flex justify-between  pb-5 mb-8">
          <h2 className="text-xl font-bold mb-4">Available Tests</h2>
          <div>
          <button
              onClick={fetchTests}
              className="bg-green-400 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition mr-3"
            >
              Refresh Tests
            </button>
            <Link
              href="/candidate/UserResult"
              className=" px-6 py-3 bg-green-400 rounded-lg text-white  hover:bg-orange-400 text-left transition m-3"
            >
              Go To Result
            </Link>
            
            <Link
              href="/candidate/Dashboard"
              className=" px-6 py-3 bg-blue-400 rounded-lg text-white  hover:bg-orange-400 text-left transition"
            >
              Home
            </Link>
          </div>
        </div>

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

                  {/* Status Buttons */}
                  {test.permission === "allowed" && (
                    <button
                      className="bg-blue-500 hover:bg-orange-400 text-white px-6 py-2 rounded min-w-[120px] text-center"
                      onClick={() => setSelectedTest(test)}
                    >
                      ✅ Start Quiz
                    </button>
                  )}

                  {test.permission === "notallowed" && (
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded min-w-[120px] text-center"
                      onClick={() => { UpdateTestStatus(test._id); fetchTests(); }}
                    >
                      🔄 Request Retest
                    </button>
                  )}

                  {test.permission === "rejected" && (
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded min-w-[120px] text-center"
                    >
                      ❌ Rejected
                    </button>
                  )}

                  {test.permission === "pending" && (
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded min-w-[120px] text-center"
                    >
                      ⏳ Pending for Approval
                    </button>
                  )}
                </li>
              ))}
            </ul>


          ) : (
            !loading && <p className="text-gray-500">No tests available</p>
          )
        ) : (
          <div>
            <Quiz
              user={user}
              knowledgeAreaPara={selectedTest.knowledgeArea}
              categoryPara={selectedTest.category}
              testId={selectedTest._id}
            />
          </div>
        )}
      </div>
    </div>
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
