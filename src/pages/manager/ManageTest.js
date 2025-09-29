
import { useState, useMemo, useEffect } from "react";
import Layout from "./Layout";
import { ClipLoader } from "react-spinners";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { getSession } from "next-auth/react";

// Fetch all users + their tests
const fetchUsers = async () => {
  const { data } = await axios.get("/api/user");
  if (!data.success) throw new Error("Failed to fetch users");
  return data.data; // list of users
};

// API calls for mutations:
const updateStatus = async ({ userId, testId, permission }) => {
  const { data } = await axios.put("/api/tests/testUpdate", { userId, testId, permission });
  if (!data.success) throw new Error(data.message || "Failed update");
  return data;
};

const deleteTest = async ({ userId, testId }) => {
  await axios.delete("/api/tests/testDelete", { data: { userId, testId } });
  return { userId, testId };
};

const addTest = async ({ userId, testName, category, knowledgeArea }) => {
  const { data } = await axios.post("/api/tests/testPost", { userId, testName, category, knowledgeArea });
  return { userId, test: data.test };
};
function ManageTest({ user }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const statusMutation = useMutation({
    mutationFn: updateStatus,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] }) // ✅ Re-fetch updated data
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] }) // ✅ Re-fetch updated data
    },
  });

  const addMutation = useMutation({
    mutationFn: addTest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setModalOpen(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] }) // ✅ Re-fetch updated data
    },
  });


  const displayedUsers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return users
      .filter(usr => usr.role.toLowerCase() === "employee")
      .filter(usr =>
        usr.name.toLowerCase().includes(q) ||
        usr.email.toLowerCase().includes(q) ||
        usr.category.toLowerCase().includes(q)
      );
  }, [users, searchQuery]);

  return (
    <Layout user={user}>
      <div className="container mx-auto py-8">
        <div className="flex justify-between mb-5">
          <input
            placeholder="Search..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="p-2 w-80 border rounded"
          />
          <Link href="/manager/AssignMultipleTest">
            <div className="bg-yellow-400 py-2 px-4 rounded hover:bg-yellow-500">Add test to multiple users</div>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader size={50} color="#3498db" loading />
          </div>
        ) : (
          displayedUsers.map(u => (
            <div key={u._id} className="border p-4 rounded-lg mb-4">
              <p><strong>{u.name}</strong> – {u.email}</p>
              <p>{u.knowledgeArea} / {u.category} / {u.role}</p>
              {(u.tests || []).map(t => (
                <div key={t._id} className="flex justify-between bg-gray-100 p-2 my-2 rounded">
                  <span>{t.name} – {t.category} ({t.permission})</span>
                  <div className="space-x-2">
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded"
                      onClick={() => deleteMutation.mutate({ userId: u._id, testId: t._id })}
                    >
                      Delete
                    </button>
                    {t.permission === "pending" && (
                      <>
                        <button
                          className="px-3 py-1 bg-green-500 text-white rounded"
                          onClick={() => statusMutation.mutate({ userId: u._id, testId: t._id, permission: "allowed" })}
                        >
                          Approve
                        </button>
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded"
                          onClick={() => statusMutation.mutate({ userId: u._id, testId: t._id, permission: "rejected" })}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {t.permission === "rejected" && (
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded"
                        onClick={() => statusMutation.mutate({ userId: u._id, testId: t._id, permission: "allowed" })}
                      >
                        Permit Again
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => { setSelectedUserId(u._id); setModalOpen(true); }}
              >
                Add Test
              </button>
            </div>
          ))
        )}

        {modalOpen && (
          <AddTestModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onAdd={addMutation.mutate}
            userId={selectedUserId}
          />
        )}
      </div>
    </Layout>
  );
}

// 🎯 Modal Component
function AddTestModal({ isOpen, onClose, onAdd, userId }) {
  const [testName, setTestName] = useState("");
  const [knowledgeAreas, setKnowledgeAreas] = useState([]);
  const [knowledgeArea, setKnowledgeArea] = useState("");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    axios.get("/api/knowledgeAreas").then(r => {
      if (r.data.success) setKnowledgeAreas(r.data.data);
    });
  }, []);

  useEffect(() => {
    const area = knowledgeAreas.find(a => a.name === knowledgeArea);
    setCategories(area?.categories || []);
    setCategory("");
  }, [knowledgeArea, knowledgeAreas]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onAdd({ userId, testName, knowledgeArea, category });
          onClose();
        }}
        className="bg-white p-6 w-96 rounded shadow-lg"
      >
        <h3 className="text-xl mb-4 font-semibold">Add Test</h3>

        <input
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
          placeholder="Test Name"
          className="w-full p-2 border rounded mb-3"
          required
        />

        <select
          value={knowledgeArea}
          onChange={(e) => setKnowledgeArea(e.target.value)}
          className="w-full p-2 border rounded mb-3"
          required
        >
          <option value="">Select Knowledge Area</option>
          {knowledgeAreas.map((a) => (
            <option key={a._id} value={a.name}>
              {a.name}
            </option>
          ))}
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded mb-3"
          required
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end space-x-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </form>
    </div>

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



export default ManageTest;
