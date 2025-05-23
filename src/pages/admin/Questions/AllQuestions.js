import { useRouter } from "next/router";
import Layout from "../Layout"; // Adjust the path if needed
import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners"; // Import spinner from react-spinners
import { getSession } from "next-auth/react";
import axios from "axios";

function AllQuestions({ initialQuestions = [], user }) {
  const router = useRouter();
  const [questions, setQuestions] = useState(initialQuestions);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [knowledgeAreas, setKnowledgeAreas] = useState([]); // Initialize as an empty array
  const [knowledgeArea, setKnowledgeArea] = useState('all');
  const [difficulty, setDifficulty] = useState('all');



   // Fetch knowledge areas and categories from the API
    useEffect(() => {
      async function fetchData() {
        try {
          const response = await fetch("/api/knowledgeAreas");
          const result = await response.json();
  
          if (result.success && Array.isArray(result.data)) {
            setKnowledgeAreas(result.data); // Use the data array directly
          } else {
            console.error("Unexpected data format:", result);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
  
      fetchData();
    }, []);
  

  


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

  // ✅ Optimized Fetch Function
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/questions/getQuestions");
      const data = await res.json();
      const size = data.data ? data.data.length : 0;
      console.log(size);

      if (data.success) {
        setQuestions(data.data);
      } else {
        throw new Error("Failed to fetch questions.");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false); // Ensure loading state is cleared
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };


  const filteredQuestions = questions.filter((question) => {
    const query = searchQuery.toLowerCase();
  
    const matchesSearch =
      question?.question?.toLowerCase().includes(query) ||
      question?.knowledge_area?.toLowerCase().includes(query);
  
    const matchesKnowledgeArea =
      knowledgeArea === 'all' || question?.knowledge_area?.toLowerCase() === knowledgeArea.toLowerCase();
  
    const matchesDifficulty =
      difficulty === 'all' || question?.difficulty?.toLowerCase() === difficulty.toLowerCase();
  
    return matchesSearch && matchesKnowledgeArea && matchesDifficulty;
  });
  
  
  



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
          <div style={{width: "50%"}}>
          <label className="block text-gray-700 font-bold mb-2">
                  Search Question:
                </label>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search questions..."
            style={{
              padding: "5px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "1rem",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          />
          </div>

         <div className="flex justify-between">
              <div className="mr-5">
                <label className="block text-gray-700 font-bold mb-2">
                  Knowledge Area:
                </label>
                <select
                  value={knowledgeArea}
                  onChange={(e) => setKnowledgeArea(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="" disabled>
                    Select Knowledge Area
                  </option>
                  <option value="all">All Questions</option>
                  {knowledgeAreas.map((area) => (
                    <option key={area._id} value={area.name}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
               <label className="block text-gray-700 font-bold mb-2">
                Difficulty Level:
                 </label>
                   <select
    value={difficulty}
    onChange={(e) => setDifficulty(e.target.value)}
    className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
  >
    <option value="all">All Difficulties</option>
    <option value="Easy">Easy</option>
    <option value="Medium">Medium</option>
    <option value="Hard">Hard</option>
                    </select>
              </div>

         </div>

          <button
            onClick={() => router.push("/admin/Questions/addQuestion")}
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

        {/* 🔹 Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <ClipLoader size={50} color="#3498db" loading={loading} />
          </div>
        )}

        {/* 🔹 Display Questions */}
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
                display: "flex",
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


              <div>
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
    </Layout>
  );
}

// ✅ Protect the page with server-side authentication
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

export default AllQuestions;
