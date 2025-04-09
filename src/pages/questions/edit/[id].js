// import { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import Layout from "../../admin/Layout";
// import Router from "next/router";

// export default function EditQuestion() {
//   const [questionData, setQuestionData] = useState(null);
//   const [knowledgeAreas, setKnowledgeAreas] = useState([]);
//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [newOption, setNewOption] = useState("");
//   const router = useRouter();
//   const { id } = router.query;

//   useEffect(() => {
//     if (id) {
//       fetch(`/api/questions/getQuestions?id=${id}`)
//         .then((res) => res.json())
//         .then((data) => setQuestionData(data.data));
//     }

//     fetch("/api/knowledgeAreas")
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) {
//           setKnowledgeAreas(data.data);
//         }
//       });
//   }, [id]);

//   const handleKnowledgeAreaChange = (selectedArea) => {
//     const selectedAreaData = knowledgeAreas.find(
//       (area) => area.name === selectedArea
//     );
//     setSelectedCategories(selectedAreaData?.categories || []);
//     setQuestionData({
//       ...questionData,
//       knowledge_area: selectedArea,
//       category: "", // Reset category when knowledge area changes
//     });
//   };

//   const handleAddOption = () => {
//     if (newOption.trim()) {
//       setQuestionData({
//         ...questionData,
//         options: [...(questionData.options || []), { text: newOption.trim() }],
//       });
//       setNewOption("");
//     }
//   };

//   const handleEditOption = (index, newValue) => {
//     const updatedOptions = [...questionData.options];
//     updatedOptions[index].text = newValue;
//     setQuestionData({ ...questionData, options: updatedOptions });
//   };

//   const handleRemoveOption = (index) => {
//     const updatedOptions = questionData.options.filter((_, i) => i !== index);
//     setQuestionData({ ...questionData, options: updatedOptions });
//   };

//   const handleSelectCorrectAnswer = (optionText) => {
//     setQuestionData({ ...questionData, correct_option: optionText });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const res = await fetch(`/api/questions/updateQuestion?id=${id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(questionData),
//     });
//     const data = await res.json();
//     if (data.success) {
//       alert("updated");
//       Router.push("/admin/Questions/AllQuestions");
//     }
//   };

//   if (!questionData) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
//       <h1 style={{ textAlign: "center" }}>Edit Question</h1>
//       <form onSubmit={handleSubmit}>
//         {/* Question */}
//         <div style={{ marginBottom: "20px" }}>
//           <label>Question</label>
//           <textarea
//             value={questionData.question}
//             onChange={(e) =>
//               setQuestionData({ ...questionData, question: e.target.value })
//             }
//             required
//             rows="3"
//             style={{ width: "100%", padding: "8px" }}
//           />
//         </div>

//         {/* Knowledge Area */}
//         <div style={{ marginBottom: "20px" }}>
//           <label>Knowledge Area</label>
//           <select
//             value={questionData.knowledge_area || ""}
//             onChange={(e) => handleKnowledgeAreaChange(e.target.value)}
//             required
//             style={{ width: "100%", padding: "8px" }}
//           >
//             <option value="" disabled>
//               Select Knowledge Area
//             </option>
//             {knowledgeAreas.map((area) => (
//               <option key={area._id} value={area.name}>
//                 {area.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Category */}
//         <div style={{ marginBottom: "20px" }}>
//           <label>Category</label>
//           <select
//             value={questionData.category || ""}
//             onChange={(e) =>
//               setQuestionData({ ...questionData, category: e.target.value })
//             }
//             required
//             style={{ width: "100%", padding: "8px" }}
//           >
//             <option value="" disabled>
//               Select Category
//             </option>
//             {selectedCategories.map((cat) => (
//               <option key={cat._id} value={cat.name}>
//                 {cat.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Difficulty Level */}
//         <div style={{ marginBottom: "20px" }}>
//           <label>Difficulty Level</label>
//           <select
//             value={questionData.difficulty || ""}
//             onChange={(e) =>
//               setQuestionData({ ...questionData, difficulty: e.target.value })
//             }
//             required
//             style={{ width: "100%", padding: "8px" }}
//           >
//             <option value="" disabled>
//               Select Difficulty Level
//             </option>
//             {["Easy", "Medium", "Hard"].map((level) => (
//               <option key={level} value={level}>
//                 {level}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Options */}
//         <div style={{ marginBottom: "20px" }}>
//           <label>Options</label>
//           <ul>
//             {questionData.options?.map((option, index) => (
//               <li key={index} style={{ marginBottom: "8px" }}>
//                 <input
//                   type="text"
//                   value={option.text}
//                   onChange={(e) => handleEditOption(index, e.target.value)}
//                   style={{ width: "60%", padding: "8px", marginRight: "8px" }}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => handleSelectCorrectAnswer(option.text)}
//                   style={{
//                     backgroundColor:
//                       questionData.correct_option === option.text
//                         ? "green"
//                         : "#ccc",
//                     color: "white",
//                     border: "none",
//                     padding: "6px 12px",
//                     cursor: "pointer",
//                     marginRight: "8px",
//                   }}
//                 >
//                   {questionData.correct_option === option.text
//                     ? "Correct"
//                     : "Set Correct"}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => handleRemoveOption(index)}
//                   style={{
//                     backgroundColor: "red",
//                     color: "white",
//                     border: "none",
//                     padding: "6px 12px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   Remove
//                 </button>
//               </li>
//             ))}
//           </ul>
//           <div>
//             <input
//               type="text"
//               value={newOption}
//               onChange={(e) => setNewOption(e.target.value)}
//               placeholder="Add new option"
//               style={{ width: "60%", padding: "8px", marginRight: "8px" }}
//             />
//             <button
//               type="button"
//               onClick={handleAddOption}
//               style={{
//                 backgroundColor: "#28a745",
//                 color: "white",
//                 border: "none",
//                 padding: "6px 12px",
//                 cursor: "pointer",
//               }}
//             >
//               Add Option
//             </button>
//           </div>
//         </div>

//         <button
//           type="submit"
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#007bff",
//             color: "white",
//             border: "none",
//             cursor: "pointer",
//             marginTop: "20px",
//           }}
//         >
//           Update Question
//         </button>
//       </form>
//     </div>
//   );
// }

// EditQuestion.getLayout = function getLayout(page) {
//   return <Layout>{page}</Layout>;
// };


import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../admin/Layout";
import Router from "next/router";

export default function EditQuestion() {
  const [questionData, setQuestionData] = useState(null);
  const [knowledgeAreas, setKnowledgeAreas] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [newOption, setNewOption] = useState("");
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetch(`/api/questions/getQuestions?id=${id}`)
        .then((res) => res.json())
        .then((data) => setQuestionData(data.data));
    }

    fetch("/api/knowledgeAreas")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setKnowledgeAreas(data.data);
        }
      });
  }, [id]);

  const handleKnowledgeAreaChange = (selectedArea) => {
    const selectedAreaData = knowledgeAreas.find(
      (area) => area.name === selectedArea
    );
    setSelectedCategories(selectedAreaData?.categories || []);
    setQuestionData({
      ...questionData,
      knowledge_area: selectedArea,
      category: "", // Reset category when knowledge area changes
    });
  };

  // const handleAddOption = () => {
  //   if (newOption.trim()) {
  //     setQuestionData({
  //       ...questionData,
  //       options: [...(questionData.options || []), { text: newOption.trim() }],
  //     });
  //     setNewOption("");
  //   }
  // };

  const handleEditOption = (index, newValue) => {
    const updatedOptions = [...questionData.options];
    updatedOptions[index].text = newValue;
    setQuestionData({ ...questionData, options: updatedOptions });
  };

  // const handleRemoveOption = (index) => {
  //   const updatedOptions = questionData.options.filter((_, i) => i !== index);
  //   setQuestionData({ ...questionData, options: updatedOptions });
  // };

  const handleSelectCorrectAnswer = (optionText) => {
    setQuestionData({ ...questionData, correct_option: optionText });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/questions/updateQuestion?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(questionData),
    });
    const data = await res.json();
    if (data.success) {
      alert("Updated Successfully");
      Router.push("/manager/Questions/AllQuestions");
    }
  };

  if (!questionData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* <h1 className="text-2xl font-semibold text-center mb-8">Edit Question</h1> */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Question</label>
          <textarea
            value={questionData.question}
            onChange={(e) =>
              setQuestionData({ ...questionData, question: e.target.value })
            }
            required
            rows="4"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        </div>


       <div className="flex justify-between">
        {/* Knowledge Area */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Knowledge Area</label>
          <select
            value={questionData.knowledge_area || ""}
            onChange={(e) => handleKnowledgeAreaChange(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200"
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

        {/* Category */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Category</label>
          <select
            value={questionData.category || ""}
            onChange={(e) =>
              setQuestionData({ ...questionData, category: e.target.value })
            }
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            <option value="" disabled>
              Select Category
            </option>
            {selectedCategories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Level */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Difficulty Level</label>
          <select
            value={questionData.difficulty || ""}
            onChange={(e) =>
              setQuestionData({ ...questionData, difficulty: e.target.value })
            }
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            <option value="" disabled>
              Select Difficulty Level
            </option>
            {["Easy", "Medium", "Hard"].map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
        </div>

        {/* Options */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Options</label>
          <ul className="space-y-2">
            {questionData.options?.map((option, index) => (
              <li key={index} className="flex items-center justify-between space-x-2">
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => handleEditOption(index, e.target.value)}
                  className="w-1/2 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
                <button
                  type="button"
                  onClick={() => handleSelectCorrectAnswer(option.text)}
                  className={`px-4 py-2 rounded-md text-white ${questionData.correct_option === option.text ? 'bg-green-500' : 'bg-blue-500'} transition duration-200`}
                >
                  {questionData.correct_option === option.text ? 'Correct' : 'Set Correct'}
                </button>
                {/* <button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                >
                  Remove
                </button> */}
              </li>
            ))}
          </ul>

          {/* Add Option
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              placeholder="Add new option"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
            <button
              type="button"
              onClick={handleAddOption}
              className="px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Add Option
            </button>
          </div> */}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
        >
          Update Question
        </button>
      </form>
    </div>
  );
}

EditQuestion.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
