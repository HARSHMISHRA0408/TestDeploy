import { useRouter } from "next/router";
import Layout from "../Layout"; // Adjust the path if needed
import { useState, useEffect, useCallback } from "react";
import { ClipLoader } from "react-spinners"; // Import spinner from react-spinners
import React from "react";
import { getSession } from "next-auth/react";
import axios from "axios";


function AllQuestions({ user }) {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
 

  
  // ✅ Optimized Delete Function
  const deleteQuestion = async (questionId) => {
    if (!questionId) {
      alert("Question ID is required!");
      return;
    }

    try {
      const response = await axios.delete("/api/questions/deleteQuestion", {
        data: { questionId },
      });

      if (response.data.success) {
        alert("Question deleted successfully!");

        // 🔹 Remove deleted question from UI
        setQuestions((prevQuestions) =>
          prevQuestions.filter((question) => question._id !== questionId)
        );
      } else {
        throw new Error(response.data.message || "Failed to delete question.");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      alert(error.response?.data?.message || "Failed to delete the question.");
    }
  };

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const userKnowledgeAreas = user?.manageKnowledgeArea || [];
  
      const res = await fetch("/api/questions/getQuestions");
      const dataun = await res.json();
      console.log("API Response:", dataun);
  
      if (Array.isArray(dataun.data)) {
        const filteredQuestions = dataun.data.filter((question) =>
          userKnowledgeAreas.some(
            (area) => question.knowledge_area === area
          )
        );
        setQuestions(filteredQuestions);
        console.log("Filtered Questions:", filteredQuestions);
      } else {
        console.error("Unexpected response format: data is not an array");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.manageKnowledgeArea]);
  
  useEffect(() => {
      fetchQuestions();
  }, [fetchQuestions]);



  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredQuestions = questions.filter((question) =>
    question.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // useEffect(() => {
  //   fetchQuestions();
  // }, []);

  return (
    <Layout user={user}>
      <div style={{ padding: "20px" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>All Questions</h1>

        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search questions..."
            style={{
              padding: "10px",
              width: "60%",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "1rem",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          />
          <button
            onClick={() => router.push("/manager/Questions/addQuestion")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              fontSize: "1rem",
            }}
          >
            Add Question
          </button>
        </div>

        <div>
          {loading && (
            <div className="flex justify-center items-center h-64">
              <ClipLoader size={50} color="#3498db" loading={loading} />
            </div>
          )}

          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((question) => (
              <div
                key={question._id}
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  marginBottom: "15px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#fff",
                  transition: "all 0.3s ease",
                  
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h3 style={{ fontSize: "1.25rem", marginBottom: "10px" }}>
                    {question.question}
                  </h3>
                  <p style={{ fontSize: "1rem", marginBottom: "5px" }}>
                    <strong>Category:</strong> {question.category}
                  </p>
                  <p style={{ fontSize: "1rem", marginBottom: "10px" }}>
                    <strong>Difficulty:</strong> {question.difficulty}
                  </p>
                </div>

                <div className="flex justify-end">
                  {/* 🔹 Edit Button */}
                  <button
                    onClick={() => router.push(`/questions/edit/${question._id}`)}
                    style={{
                      padding: "8px 15px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "1rem",
                      transition: "background-color 0.3s",
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
                  >
                    Edit
                  </button>

                  {/* 🔹 Delete Button */}
                  <button
                    onClick={() => deleteQuestion(question._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 ml-2"
                  >
                    Delete Question
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No questions available.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}


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


// // Apply layout to the AllQuestions page
// AllQuestions.getLayout = function getLayout(page) {
//   return <Layout>{page}</Layout>;
// };

export default AllQuestions;
