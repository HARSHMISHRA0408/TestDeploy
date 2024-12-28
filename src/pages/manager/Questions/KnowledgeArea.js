// import { useState, useEffect } from "react";
// import Layout from "../Layout";

// function KnowledgeAreasPage() {
//   const [knowledgeAreas, setKnowledgeAreas] = useState([]);
//   const [form, setForm] = useState({ name: "", categories: [""] });
//   const [editing, setEditing] = useState(null);
//   const [message, setMessage] = useState("");

//   const fetchKnowledgeAreas = async () => {
//     const res = await fetch("/api/knowledgeAreas");
//     const data = await res.json();
//     if (data.success) setKnowledgeAreas(data.data);
//   };

//   useEffect(() => {
//     fetchKnowledgeAreas();
//   }, []);

//   const handleChange = (e, index) => {
//     if (e.target.name === "categories") {
//       const newCategories = [...form.categories];
//       newCategories[index] = e.target.value;
//       setForm({ ...form, categories: newCategories });
//     } else {
//       setForm({ ...form, [e.target.name]: e.target.value });
//     }
//   };

//   const addCategoryField = () =>
//     setForm({ ...form, categories: [...form.categories, ""] });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const method = editing ? "PUT" : "POST";
//     const url = "/api/knowledgeAreas";

//     const res = await fetch(url, {
//       method,
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         ...form,
//         categories: form.categories.map((cat) => cat),
//       }),
//     });

//     const data = await res.json();
//     if (data.success) {
//       setMessage(editing ? "Knowledge area updated" : "Knowledge area created");
//       setForm({ name: "", categories: [""] });
//       setEditing(null);
//       fetchKnowledgeAreas();
//     } else {
//       setMessage("Error saving knowledge area");
//     }
//   };

//   // const handleEdit = (area) => {
//   //   setForm({ name: area.name, categories: area.categories.map(cat => cat.name) });
//   //   setEditing(area);
//   // };
//   const handleEdit = (area) => {
//     console.log("Editing knowledge area:", area); // Verify area data
  
//     setForm({
//       name: area.name,
//       categories: area.categories.map((cat) => cat.name), // Only map category names
//     });
//     setEditing(area); // Track the currently edited area
//   };
  

//   const handleDelete = async (id) => {
//     const res = await fetch("/api/knowledgeAreas", {
//       method: "DELETE",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ id }),
//     });
//     const data = await res.json();
//     if (data.success) {
//       setMessage("Knowledge area deleted");
//       fetchKnowledgeAreas();
//     }
//   };

//   return (
//     <div className="container mx-auto py-8">
//       <h1 className="text-2xl font-bold mb-4">Knowledge Areas</h1>

//       <form onSubmit={handleSubmit} className="mb-6">
//         <input
//           type="text"
//           name="name"
//           value={form.name}
//           onChange={handleChange}
//           placeholder="Knowledge Area Name"
//           required
//           className="border p-2 mr-2 mb-2"
//         />
//         {form.categories.map((category, index) => (
//           <input
//             key={index}
//             type="text"
//             name="categories"
//             value={category}
//             onChange={(e) => handleChange(e, index)}
//             placeholder={`Category ${index + 1}`}
//             required
//             className="border p-2 mr-2 mb-2"
//           />
//         ))}

//         <button
//           type="button"
//           onClick={addCategoryField}
//           className="bg-gray-200 p-2 rounded"
//         >
//           + Add Category
//         </button>

//         <button
//           type="submit"
//           className="bg-blue-500 text-white p-2 rounded ml-2"
//         >
//           {editing ? "Update" : "Add"} Knowledge Area
//         </button>
//       </form>

//       {message && <p className="text-green-600">{message}</p>}

//       <div>
//         {knowledgeAreas.map((area) => (
//           <div key={area._id} className="border p-4 mb-4 rounded-lg">
//             <h2 className="font-bold text-xl">{area.name}</h2>
//             <ul className="ml-4 list-disc">
//               {area.categories.map((cat, idx) => (
//                 <li key={idx}>{cat.name}</li>
//               ))}
//             </ul>
//             <button
//               onClick={() => handleEdit(area)}
//               className="bg-yellow-400 text-white p-1 rounded mr-2 mt-2"
//             >
//               Edit
//             </button>
//             <button
//               onClick={() => handleDelete(area._id)}
//               className="bg-red-500 text-white p-1 rounded mt-2"
//             >
//               Delete
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// KnowledgeAreasPage.getLayout = function getLayout(page) {
//   return <Layout>{page}</Layout>;
// };

// export default KnowledgeAreasPage;

import { useState, useEffect } from "react";
import Layout from "../Layout";

function KnowledgeAreasPage() {
  const [knowledgeAreas, setKnowledgeAreas] = useState([]);
  const [form, setForm] = useState({ name: "", categories: [""] });
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");

  const fetchKnowledgeAreas = async () => {
    try {
      const res = await fetch("/api/knowledgeAreas");
      const data = await res.json();
      if (data.success) setKnowledgeAreas(data.data);
    } catch (error) {
      console.error("Error fetching knowledge areas:", error);
    }
  };

  useEffect(() => {
    fetchKnowledgeAreas();
  }, []);

  const handleChange = (e, index) => {
    if (e.target.name === "categories") {
      const newCategories = [...form.categories];
      newCategories[index] = e.target.value;
      setForm({ ...form, categories: newCategories });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const addCategoryField = () =>
    setForm({ ...form, categories: [...form.categories, ""] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const url = "/api/knowledgeAreas";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editing?._id, // only include id in update case
          ...form,
          categories: form.categories.map((cat) => cat),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage(editing ? "Knowledge area updated" : "Knowledge area created");
        setForm({ name: "", categories: [""] });
        setEditing(null);
        fetchKnowledgeAreas();
      } else {
        setMessage("Error saving knowledge area");
      }
    } catch (error) {
      console.error("Error saving knowledge area:", error);
      setMessage("Error saving knowledge area");
    }
  };

  const handleEdit = (area) => {
    setForm({
      name: area.name,
      categories: area.categories.map((cat) => cat.name),
    });
    setEditing(area);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch("/api/knowledgeAreas", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Knowledge area deleted");
        fetchKnowledgeAreas();
      } else {
        setMessage("Error deleting knowledge area");
      }
    } catch (error) {
      console.error("Error deleting knowledge area:", error);
      setMessage("Error deleting knowledge area");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Knowledge Areas</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Knowledge Area Name"
          required
          className="border p-2 mr-2 mb-2"
        />
        {form.categories.map((category, index) => (
          <input
            key={index}
            type="text"
            name="categories"
            value={category}
            onChange={(e) => handleChange(e, index)}
            placeholder={`Category ${index + 1}`}
            required
            className="border p-2 mr-2 mb-2"
          />
        ))}

        <button
          type="button"
          onClick={addCategoryField}
          className="bg-gray-200 p-2 rounded"
        >
          + Add Category
        </button>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded ml-2"
        >
          {editing ? "Update" : "Add"} Knowledge Area
        </button>
      </form>

      {message && <p className="text-green-600">{message}</p>}

      <div>
        {knowledgeAreas.map((area) => (
          <div key={area._id} className="border p-4 mb-4 rounded-lg">
            <h2 className="font-bold text-xl">{area.name}</h2>
            <ul className="ml-4 list-disc">
              {area.categories.map((cat, idx) => (
                <li key={idx}>{cat.name}</li>
              ))}
            </ul>
            <button
              onClick={() => handleEdit(area)}
              className="bg-yellow-400 text-white p-1 rounded mr-2 mt-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(area._id)}
              className="bg-red-500 text-white p-1 rounded mt-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

KnowledgeAreasPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default KnowledgeAreasPage;
