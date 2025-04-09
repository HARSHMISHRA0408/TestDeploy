
import { useState, useEffect } from "react";
import Layout from "./Layout";
import { getSession } from "next-auth/react";
import EditTestSizeForm from "../../Components/EditTestSizeForm";
import EditMarkForm from "../../Components/EditMarksForm"; // New Component

function MarksPage({ user }) {
  const [marks, setMarks] = useState([]);
  const [testSize, setTestSize] = useState(null);
  const [sizeId, setSizeId] = useState(null);
  const [editingSize, setEditingSize] = useState(false);
  const [editingMark, setEditingMark] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchMarks();
    fetchTestSize();
  }, []);

  const fetchMarks = async () => {
    try {
      const res = await fetch("/api/marks");
      const data = await res.json();
      if (data.success) setMarks(data.data);
    } catch (error) {
      console.error("Error fetching marks:", error);
    }
  };

  const fetchTestSize = async () => {
    try {
      const res = await fetch("/api/tests/testSize");
      const data = await res.json();
      if (data.testSizes.length > 0) {
        setTestSize(data.testSizes[0].size);
        setSizeId(data.testSizes[0]._id);
      }
    } catch (error) {
      console.error("Error fetching test size:", error);
    }
  };

  return (
    <Layout user={user}>
      <div className="container mx-auto py-10 px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Manage Marks</h1>

        {message && (
          <p className={`text-center mb-6 ${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
            {message}
          </p>
        )}

        {/* Marks List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marks.map((mark) => (
            <div key={mark._id} className="bg-white shadow rounded-lg p-6 flex flex-col justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  Level: <span className="text-gray-800">{mark.level}</span>
                </p>
                <p className="text-gray-600 mb-1">
                  Time: <span className="font-medium text-gray-800">{mark.time} mins</span>
                </p>
                <p className="text-gray-600">
                  Marks: <span className="font-medium text-gray-800">{mark.marks}</span>
                </p>
              </div>
              <button
                onClick={() => setEditingMark(mark)}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all"
              >
                Edit
              </button>
            </div>
          ))}
        </div>

        {/* Manage Test Size */}
        <div className="text-center mt-10">
          <h2 className="text-xl font-semibold text-gray-700">Test Size: {testSize}</h2>
          <button
            onClick={() => setEditingSize(true)}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all"
          >
            Edit Test Size
          </button>
        </div>

        {/* Render EditTestSizeForm when editingSize is true */}
        {editingSize && (
          <EditTestSizeForm
            testSize={testSize}
            sizeId={sizeId}
            onClose={() => setEditingSize(false)}
            onSizeUpdate={(newSize) => setTestSize(newSize)}
          />
        )}

        {/* Render EditMarkForm when a mark is being edited */}
        {editingMark && (
          <EditMarkForm
            mark={editingMark}
            onClose={() => setEditingMark(null)}
            onMarkUpdate={fetchMarks}
          />
        )}
      </div>
    </Layout>
  );
}

// Protect the page with server-side authentication
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session || session.user.role !== "manager") {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }

  return { props: { user: session.user } };
}

export default MarksPage;
