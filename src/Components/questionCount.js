import { useState, useEffect, Fragment } from "react";
//import Layout from "./Layout";
import { getSession } from "next-auth/react";
import { Dialog, Transition } from "@headlessui/react";

function QuestionCount({ user }) {
  const [counts, setCounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => {
    setIsOpen(true);
    fetchCount();
  };

  const closeDialog = () => setIsOpen(false);

  const fetchCount = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/questions/questionCount");
      const data = await res.json();
      if (data.success) {
        setCounts(data.data);
      } else {
        setError(data.message || "Failed to load question counts");
      }
    } catch (err) {
      console.error("Error fetching question counts:", err);
      setError("Error fetching question counts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto mt-8 px-4">
        {/* <h1 className="text-2xl font-bold mb-6">Admin Tools</h1> */}
        <button
          onClick={openDialog}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          View Question Counts
        </button>
      </div>

      {/* Dialog */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeDialog}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-40" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-90"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-90"
            >
              <Dialog.Panel className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-6">
                <Dialog.Title className="text-xl font-semibold mb-4">
                  Question Counts by Knowledge Area & Category
                </Dialog.Title>

                {loading && <p className="text-gray-500">Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && counts.length > 0 && (
                  <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border border-gray-300 px-4 py-2 text-left">
                            Knowledge Area
                          </th>
                          <th className="border border-gray-300 px-4 py-2 text-left">
                            Category
                          </th>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                            Difficulty
                          </th>
                          <th className="border border-gray-300 px-4 py-2 text-center">
                            Total Questions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {counts.map((item, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">
                              {item.knowledge_area}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {item.category}
                            </td>
                              <td className="border border-gray-300 px-4 py-2">
                              {item.difficulty}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center font-semibold">
                              {item.totalQuestions}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {!loading && counts.length === 0 && !error && (
                  <p className="text-gray-500">No question data found.</p>
                )}

                <div className="mt-6 text-right">
                  <button
                    onClick={closeDialog}
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

// Protect the page with server-side authentication
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session || session.user.role !== "admin") {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }

  return { props: { user: session.user } };
}

export default QuestionCount;
