import React, { useState, useEffect } from "react";
import Layout from "../Layout";
import { getSession } from "next-auth/react";

// import { Router } from "next/router";

export default function AddQuestion() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState("");
  const [knowledgeArea, setKnowledgeArea] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [message, setMessage] = useState("");

  const [knowledgeAreas, setKnowledgeAreas] = useState([]); // Initialize as an empty array
  const [categories, setCategories] = useState([]);

  // Fetch knowledge areas and categories from the API
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

  // Update categories when the knowledge area changes
  useEffect(() => {
    if (knowledgeArea) {
      const selectedArea = knowledgeAreas.find(
        (area) => area.name === knowledgeArea
      );
      setCategories(selectedArea ? selectedArea.categories : []);
    } else {
      setCategories([]);
    }
  }, [knowledgeArea, knowledgeAreas]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/questions/createQuestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          options: options.map((option) => ({ text: option })),
          correct_option: correctOption,
          knowledge_area: knowledgeArea,
          category,
          difficulty,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Question saved successfully !");
        // Clear form
        setQuestion("");
        setOptions(["", "", "", ""]);
        setCorrectOption("");
        setKnowledgeArea("");
        setCategory("");
        setDifficulty("");
        // Router.push("/admin/Questions/AllQuestions");
      } else {
        setMessage("Failed to save the question.");
      }
    } catch (error) {
      console.error("Error saving question:", error);
      setMessage("An error occurred while saving the question.");
    }
  };

  return (
    <div className="flex justify-center items-center  h-auto p-1">
      <div className="w-full max-w-3xl h-full bg-white p-8 rounded-lg shadow-lg overflow-auto">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col h-full justify-between"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Question:
              </label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Options:
              </label>
              {options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  required
                  className="w-full mb-2 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              ))}
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Correct Option:
              </label>
              <input
                type="text"
                value={correctOption}
                onChange={(e) => setCorrectOption(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>


            <div className="flex justify-between">
              <div>
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
                  {knowledgeAreas.map((area) => (
                    <option key={area._id} value={area.name}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Category:
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat._id || cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Difficulty:
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="Easy">easy</option>
                  <option value="Medium">medium</option>
                  <option value="Hard">hard</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Save Question
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-green-600 font-semibold">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

// Protect the page with server-side authentication
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session || (session.user.role !== "admin" && session.user.role !== "manager")) {
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

AddQuestion.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
