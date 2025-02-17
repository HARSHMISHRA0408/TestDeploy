import { useState, useEffect } from "react";
import Layout from "../Layout";
import React from "react";
import { getSession, signOut } from "next-auth/react";



function KnowledgeAreasPage({ user }) {
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
          id: editing?._id,
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
    <Layout user={user}>
      <div className="container mx-auto py-10 px-6">
        <h1 className="text-3xl font-semibold mb-6 text-center text-indigo-700">Knowledge Areas</h1>

        <form onSubmit={handleSubmit} className="mb-6 bg-white p-6 shadow-lg rounded-lg">
          <div className="mb-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter Knowledge Area Name"
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {form.categories.map((category, index) => (
            <div key={index} className="mb-4">
              <input
                type="text"
                name="categories"
                value={category}
                onChange={(e) => handleChange(e, index)}
                placeholder={`Category ${index + 1}`}
                required
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addCategoryField}
            className="inline-block bg-gray-200 text-gray-700 p-3 mr-3 rounded hover:bg-gray-300 transition-all mb-4"
          >
            + Add Category
          </button>

          <button
            type="submit"
            className="inline-block bg-indigo-600 text-white p-3 rounded-lg shadow-md hover:bg-indigo-700 transition-all"
          >
            {editing ? "Update" : "Add"} Knowledge Area
          </button>
        </form>

        {message && <p className="text-green-600 mb-4 text-center">{message}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {knowledgeAreas.map((area) => (
            <div key={area._id} className="bg-white p-6 shadow-lg rounded-lg hover:shadow-xl transition-all">
              <h2 className="text-xl font-semibold text-indigo-600 mb-4">{area.name}</h2>
              <ul className="ml-4 list-disc text-gray-700 mb-4">
                {area.categories.map((cat, idx) => (
                  <li key={idx}>{cat.name}</li>
                ))}
              </ul>
              <div className="flex justify-between">
                <button
                  onClick={() => handleEdit(area)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(area._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}




// Protect the page with server-side authentication
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session || session.user.role !== "admin") {
    return {
      redirect: {
        destination: "/testAuth", // Replace with your sign-in page route
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

export default KnowledgeAreasPage;