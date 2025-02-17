import { useState, useEffect, useMemo } from "react";
import Layout from "./Layout";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { getSession } from "next-auth/react";

function ManageTest({ user }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    fetchUsers();

  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/user");
      if (data.success) {
        setUsers(data.data);
        setFilteredUsers(data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const UpdateTestStatus = (userId, testId, permission) => {
    try {
      // Update the user's 'test' status to 'notallowed'
      fetch("/api/tests/testUpdate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is stored and retrieved
        },
        body: JSON.stringify({ userId, testId, permission }),
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


  const handleDeleteTest = async (userId, testId) => {
    try {
      setLoading(true);
      await axios.delete("/api/tests/testDelete", { data: { userId, testId } });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId
            ? { ...user, tests: user.tests.filter((test) => test._id !== testId) }
            : user
        )
      );
      setFilteredUsers((prev) => [...prev]);
    } catch (error) {
      console.error("Error deleting test:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTest = async (userId, testName, category, knowledgeArea) => {
    if (!testName || !category || !knowledgeArea) {
      alert("All fields are required");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post("/api/tests/testPost", {
        userId,
        testName,
        category,
        knowledgeArea,
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, tests: [...user.tests, data.test] } : user
        )
      );
      setFilteredUsers((prev) => [...prev]);
      setModalOpen(false);
    } catch (error) {
      console.error("Error adding test:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const displayedUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery) ||
        user.email.toLowerCase().includes(searchQuery) ||
        user.category.toLowerCase().includes(searchQuery) ||
        user.role.toLowerCase().includes(searchQuery)
    );
  }, [searchQuery, users]);

  return (
    <Layout user={user}>
      <div className="container mx-auto py-8">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by name, email, or role"
            className="p-2 w-80 border border-gray-300 rounded-lg"
          />
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <ClipLoader size={50} color="#3498db" loading={loading} />
          </div>
        )}

        <div className="space-y-4">
          {displayedUsers.map((user) => (
            <div key={user._id} className="border p-4 rounded-lg">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Knowledge Area:</strong> {user.knowledgeArea}</p>
              <p><strong>Category:</strong> {user.category}</p>
              <p><strong>Role:</strong> {user.role}</p>

              <h3 className="text-xl font-semibold mt-4">Existing Tests</h3>
              
              {/* //listing all test and manageing tests and permissions  */}
              {Array.isArray(user.tests) && user.tests.length > 0 ? (
                <div className="space-y-4">
                  {user.tests.filter(Boolean).map((test) => (
                    <div key={test?._id || Math.random()} className="flex justify-between bg-gray-100 p-4 rounded-md">
                      <p>
                        {test?.name || "Unknown Test"} - {test?.category || "Unknown Category"} (
                        {test?.permission === "allowed" ? "Allowed" : "Not Allowed"})
                      </p>
                      <button
                        className="px-4 py-2 text-white bg-red-500 rounded-md"
                        onClick={() => test?._id && handleDeleteTest(user._id, test._id)}
                      >
                        Delete
                      </button>
                      {test.permission === "pending" && (  // Corrected this part
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded"
                          onClick={() => UpdateTestStatus(user._id, test._id, "allowed")}
                        >
                          Approve
                        </button>
                      )}
                      {test.permission === "pending" && (  // Corrected this part
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded"
                          onClick={() => UpdateTestStatus(user._id, test._id, "rejected")}
                        >
                          Reject
                        </button>
                      )}

                      {test.permission === "rejected" && (  // Corrected this part
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded"
                          onClick={() => UpdateTestStatus(user._id, test._id, "allowed")}
                        >
                          Remove Restriction
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No tests available</p>
              )}


              <button
                className="px-4 py-2 text-white bg-blue-500 rounded-md mt-4"
                onClick={() => {
                  setSelectedUserId(user._id);
                  setModalOpen(true);
                }}
              >
                Add Test
              </button>
            </div>
          ))}
        </div>

        {modalOpen && (
          <AddTestModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            handleAddTest={handleAddTest}
            userId={selectedUserId}
          />
        )}
      </div>
    </Layout>
  );
}

const AddTestModal = ({ isOpen, onClose, handleAddTest, userId }) => {
  const [testName, setTestName] = useState("");
  const [category, setCategory] = useState("");
  const [knowledgeArea, setKnowledgeArea] = useState("");
  const [knowledgeAreas, setKnowledgeAreas] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchKnowledgeAreas = async () => {
    try {
      const { data } = await axios.get("/api/knowledgeAreas");
      if (data.success) setKnowledgeAreas(data.data);
    } catch (error) {
      console.error("Error fetching knowledge areas:", error);
    }
  };

  useEffect(() => {
    fetchKnowledgeAreas();
  }, []);
  // Update categories when knowledgeArea changes
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

  const handleSubmit = () => {
    if (!testName || !category || !knowledgeArea) {
      alert("All fields are required");
      return;
    }
    handleAddTest(userId, testName, category, knowledgeArea);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add New Test</h2>
        <input type="text" placeholder="Test Name" value={testName} onChange={(e) => setTestName(e.target.value)} className="w-full p-2 border border-gray-300 rounded mb-2" />

        {/* <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border border-gray-300 rounded mb-2" /> */}

        {/* <input type="text" placeholder="Knowledge Area" value={knowledgeArea} onChange={(e) => setKnowledgeArea(e.target.value)} className="w-full p-2 border border-gray-300 rounded mb-4" /> */}
        <div className="mb-4">
          <label className="block text-gray-700">Knowledge Area:</label>
          <select
            name="knowledgeArea"
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

        <div className="mb-4">
          <label className="block text-gray-700">Category:</label>
          <select
            name="category"
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

        <div className="flex justify-between">
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">Add Test</button>
        </div>
      </div>
    </div>
  );
};


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



export default ManageTest;
