import { useState, useEffect } from "react";
import Layout from "./Layout";
import { getSession } from "next-auth/react";

export default function ManageManager({user}) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  //knowledge area for adding new knowledge area in manager profile
  const [knowledgeArea, setKnowledgeArea] = useState("");

  //Fetched knowlwdge area to give data on dropdown menu
  const [knowledgeAreas, setKnowledgeAreas] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch all users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        if (data.success) {
          // Filter users by role = "manager"
          const filteredUsers = data.data.filter(user => user.role === "manager");
          setUsers(filteredUsers);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const fetchKnowledgeAreas = async () => {
    const res = await fetch("/api/knowledgeAreas");
    const data = await res.json();
    if (data.success) {
      setKnowledgeAreas(data.data);
    }
  };

  useEffect(() => {
    fetchKnowledgeAreas();
  }, []);


  // Function to add a knowledge area
  const handleAddKnowledge = async () => {
    if (!knowledgeArea.trim() || !selectedUser) return;
    setLoading(true);
    try {
      const res = await fetch("/api/manager/managerapi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser._id, knowledgeArea }),
      });
      const data = await res.json();
      if (data.success) {
        updateUser(data.user);
        setMessage("Knowledge area added successfully!");
      } else {
        setMessage("Failed to add knowledge area.");
      }
    } catch (error) {
      console.error("Error adding knowledge area:", error);
    }
    setLoading(false);
    setKnowledgeArea("");
  };

  // Function to remove a knowledge area
  const handleRemoveKnowledge = async (area) => {
    if (!selectedUser) return;
    setLoading(true);
    try {
      const res = await fetch("/api/manager/managerapi", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser._id, knowledgeArea: area }),
      });
      const data = await res.json();
      if (data.success) {
        updateUser(data.user);
        setMessage("Knowledge area removed successfully!");
      } else {
        setMessage("Failed to remove knowledge area.");
      }
    } catch (error) {
      console.error("Error removing knowledge area:", error);
    }
    setLoading(false);
  };

  // Update user in state after edit
  const updateUser = (updatedUser) => {
    setUsers(users.map((user) => (user._id === updatedUser._id ? updatedUser : user)));
    setSelectedUser(updatedUser);
  };

  return (
    <Layout user={user}>
      <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Manage Users & Knowledge Areas</h2>

        {/* User List */}
        <h3 className="font-semibold">Users:</h3>
        <ul className="mb-4">
          {users.map((user) => (
            <li key={user._id} className="flex items-center justify-between bg-gray-100 p-2 rounded-md mb-2">
              <span>{user.name} ({user.email})</span>
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={() => setSelectedUser(user)}
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal for Editing Knowledge Areas */}
      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setSelectedUser(null)}
            >
              ✕
            </button>
            <h3 className="font-semibold mb-2">Editing: {selectedUser.name}</h3>

            {/* Existing Knowledge Areas */}
            <h4 className="font-semibold">Current Knowledge Areas:</h4>
            <ul className="mb-4">
              {selectedUser.manageKnowledgeArea?.map((area, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-md mb-2">
                  <span>{area}</span>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleRemoveKnowledge(area)}
                    disabled={loading}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <div className="mb-4 flex justify-around">
              <select
                name="knowledgeArea"
                value={knowledgeArea}
                onChange={(e) => setKnowledgeArea(e.target.value)}
                // onChange={handleChange}
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
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleAddKnowledge}
                disabled={loading}
              >
                Add
              </button>
            </div>

            {message && <p className="mt-4 text-green-600">{message}</p>}
          </div>
        </div>
      )}
    </Layout>
  );


  
}


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
