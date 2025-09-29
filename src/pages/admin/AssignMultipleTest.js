import { useState, useEffect } from "react";
import axios from "axios"; // Use axios for all API calls
import Layout from "./Layout";
import { getSession } from "next-auth/react";

const AssignTest = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [testName, setTestName] = useState("");
  const [category, setCategory] = useState("");
  const [knowledgeArea, setKnowledgeArea] = useState("");
  const [message, setMessage] = useState("");

  const [knowledgeAreas, setKnowledgeAreas] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch Knowledge Areas
  useEffect(() => {
    const fetchKnowledgeAreas = async () => {
      try {
        const { data } = await axios.get("/api/knowledgeAreas");
        if (data.success) {
          setKnowledgeAreas(data.data);
        } else {
          throw new Error("Failed to load knowledge areas.");
        }
      } catch (error) {
        console.error("Error fetching knowledge areas:", error);
        setError("Failed to load knowledge areas.");
      }
    };
    fetchKnowledgeAreas();
  }, []);

  // Update Categories when Knowledge Area changes
  useEffect(() => {
    const selectedArea = knowledgeAreas.find((area) => area.name === knowledgeArea);
    setCategories(selectedArea?.categories || []);
  }, [knowledgeArea, knowledgeAreas]);

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("/api/user");
        if (data.success && Array.isArray(data.data)) {
          setUsers(data.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Handle User Selection
  const handleUserSelect = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!testName || !category || !knowledgeArea || selectedUsers.length === 0) {
      setMessage("All fields are required!");
      return;
    }

    try {
      const { data } = await axios.post("/api/tests/AssignMultipleTest", {
        userIds: selectedUsers,
        testName,
        category,
        knowledgeArea,
      });

      setMessage(data.message || "Test assigned successfully");
      setTestName("");
      setCategory("");
      setKnowledgeArea("");
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error assigning test:", error);
      setMessage(error.response?.data?.message || "Failed to assign test");
    }
  };

  return (
    <Layout user={user}>
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Assign Test to Users</h2>

        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}
        {loading && <p>Loading users...</p>}

        {!loading && !error && (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Test Name"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              className="w-full border p-2 rounded mb-2"
              required
            />

            {/* Knowledge Area Selection */}
            <div className="mb-4">
              <label className="block text-gray-700">Knowledge Area:</label>
              <select
                value={knowledgeArea}
                onChange={(e) => setKnowledgeArea(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Knowledge Area</option>
                {knowledgeAreas.map((area) => (
                  <option key={area._id} value={area.name}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Selection */}
            <div className="mb-4">
              <label className="block text-gray-700">Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* User Selection */}
            <h3 className="text-md font-medium mt-4 mb-2">Select Users:</h3>
            <div className="max-h-40 overflow-y-auto border p-2 rounded">
              {users.length > 0 ? (
                users.map((user) => (
                  <label key={user._id} className="block cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleUserSelect(user._id)}
                      className="mr-2"
                    />
                    {user.name}
                  </label>
                ))
              ) : (
                <p className="text-gray-600">No users found.</p>
              )}
            </div>

            <button
              type="submit"
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Assign Test
            </button>
          </form>
        )}
      </div>
    </Layout>
  );
};

// Protect the page with server-side authentication
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

export default AssignTest;
