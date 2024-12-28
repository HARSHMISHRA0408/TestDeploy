import { useState, useEffect } from "react";
import Layout from "./Layout";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    knowledgeArea: "",
    category: "",
    role: "employee",
  });
  const [message, setMessage] = useState("");

  // Fetch users on component mount
  const fetchUsers = async () => {
    const res = await fetch("/api/user");
    const data = await res.json();
    if (data.success) setUsers(data.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (user) => {
    console.log(user); // Add this line to see if the correct user data is received
    setEditingUser(user._id);
    setForm({
      name: user.name,
      email: user.email,
      knowledgeArea: user.knowledgeArea,
      category: user.category,
      role: user.role,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/user', { // Ensure this endpoint is correct
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingUser, ...form }),
    });
    const data = await res.json();
  
    if (data.success) {
      setMessage('User updated successfully');
      setEditingUser(null);
      setForm({
        name: '',
        email: '',
        knowledgeArea: '',
        category: '',
        role: 'employee',
      });
      fetchUsers();
    } else {
      setMessage('Failed to update user');
    }
  };
  

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

      {message && <p className="text-green-600 mb-4">{message}</p>}

      {/* User List */}
      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="border p-4 rounded-lg flex justify-between items-center"
          >
            <div>
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Knowledge Area:</strong> {user.knowledgeArea}
              </p>
              <p>
                <strong>Category:</strong> {user.category}
              </p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
            </div>
            <button
              onClick={() => handleEdit(user)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* Edit Form */}
      {editingUser && (
        <form onSubmit={handleUpdate} className="mt-8 p-4 border rounded-lg">
          <h2 className="text-xl font-bold mb-4">Edit User</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Name:</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Knowledge Area:</label>
            <input
              type="text"
              name="knowledgeArea"
              value={form.knowledgeArea}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Category:</label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Role:</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
}

UsersPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default UsersPage;
