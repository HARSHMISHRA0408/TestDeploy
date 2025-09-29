
import { useState, useEffect } from "react";
import Layout from "./Layout";
import { getSession } from "next-auth/react";
import EditTestSizeForm from "../../Components/EditTestSizeForm";
import EditMarkForm from "../../Components/EditMarksForm";
import QuestionCount from "@/Components/questionCount";

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
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800">Marks & Test Management</h1>
          <p className="text-gray-600 mt-2">Manage marks, test sizes, and view available question counts.</p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div
            className={`mb-6 p-3 rounded-lg text-center ${
              message.includes("successfully")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        {/* Marks List */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Marks Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marks.map((mark) => (
              <div
                key={mark._id}
                className="bg-white shadow-md rounded-xl p-6 flex flex-col justify-between border border-gray-200 hover:shadow-lg transition"
              >
                <div>
                  <p className="text-lg font-bold text-gray-800 mb-2">{mark.level}</p>
                  <p className="text-gray-600">Time: <span className="font-medium">{mark.time} mins</span></p>
                  <p className="text-gray-600">Marks: <span className="font-medium">{mark.marks}</span></p>
                </div>
                <button
                  onClick={() => setEditingMark(mark)}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Test Size Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Test Size Management</h2>
          <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-lg font-semibold text-gray-800">
                Current Test Size: <span className="text-blue-600">{testSize}</span>
              </p>
              <p className="text-gray-500 text-sm">Adjust the number of questions per test.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setEditingSize(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition"
              >
                Edit Test Size
              </button>
              <QuestionCount />
            </div>
          </div>
        </section>

        {/* Edit Test Size Modal */}
        {editingSize && (
          <EditTestSizeForm
            testSize={testSize}
            sizeId={sizeId}
            onClose={() => setEditingSize(false)}
            onSizeUpdate={(newSize) => setTestSize(newSize)}
          />
        )}

        {/* Edit Marks Modal */}
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
