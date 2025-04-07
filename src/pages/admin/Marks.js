// import { useState, useEffect } from 'react';
// import Layout from "./Layout";
// import React from 'react';
// import { getSession } from 'next-auth/react';
// import EditTestSizeForm from "../../Components/EditTestSizeForm"; // Import new component


// function MarksPage({ user }) {
//   const [marks, setMarks] = useState([]);
//   const [testSize, setTestSize] = useState(null);
//   const [sizeId, setTestSizeId] = useState(null);
//   const [editingSize, setEditingSize] = useState(false);
//   //const [message, setMessage] = useState('');
//   const [editingMark, setEditingMark] = useState(null);
//   // const [editingSize, setEditingSize] = useState(null);
//   const [form, setForm] = useState({
//     level: 'easy',
//     time: '',
//     marks: '',
//   });
//   const [message, setMessage] = useState('');

//   // Fetch marks on component mount
//   const fetchMarks = async () => {
//     const res = await fetch('/api/marks');
//     const data = await res.json();
//     if (data.success) setMarks(data.data);
//   };

//   const fetchTestSize = async () => {
//     try {
//       const response = await fetch("/api/tests/testSize");
//       const data = await response.json();

//       // if (!response.ok || !data.success || !data.testSizes || data.testSizes.length === 0) {
//       //   throw new Error(data.message || "No test sizes found");
//       // }

//       // Extract only the size from the first object
//       setTestSize(data.testSizes[0].size);
//       setTestSizeId(data.testSizes[0]._id);
//     } catch (error) {
//       setError(error.message);
//     }
//   };


//   useEffect(() => {
//     fetchMarks();
//     fetchTestSize();
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleEdit = (mark) => {
//     setEditingMark(mark._id);
//     setForm({
//       level: mark.level,
//       time: mark.time,
//       marks: mark.marks,
//     });
//   };

//   const handleSizeEdit = (mark) => {
//     setEditingMark(mark._id);
//     setForm({
//       level: mark.level,
//       time: mark.time,
//       marks: mark.marks,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const method = 'PUT';
//     const endpoint = '/api/marks';

//     const res = await fetch(endpoint, {
//       method,
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ id: editingMark, ...form }),
//     });
//     const data = await res.json();

//     if (data.success) {
//       setMessage('Mark updated successfully');
//       setEditingMark(null);
//       setForm({ level: 'easy', time: '', marks: '' });
//       fetchMarks();
//     } else {
//       setMessage('Failed to save mark');
//     }
//   };

//   return (
//     <Layout user={user}>
//       <div className="container mx-auto py-10 px-6">
//         <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Manage Marks</h1>

//         {message && (
//           <p className={`text-center mb-6 ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>{message}</p>
//         )}

//         {/* Marks List */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {marks.map((mark) => (
//             <div key={mark._id} className="bg-white shadow rounded-lg p-6 flex flex-col justify-between">
//               <div>
//                 <p className="text-lg font-semibold text-gray-700 mb-2">Level: <span className="text-gray-800">{mark.level}</span></p>
//                 <p className="text-gray-600 mb-1">Time: <span className="font-medium text-gray-800">{mark.time} mins</span></p>
//                 <p className="text-gray-600">Marks: <span className="font-medium text-gray-800">{mark.marks}</span></p>
//               </div>
//               <button
//                 onClick={() => handleEdit(mark)}
//                 className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all"
//               >
//                 Edit
//               </button>
//             </div>
//           ))}
//           <div className="container mx-auto py-10 px-6">
//         <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Manage Test Size</h1>

//         {message && (
//           <p className={`text-center mb-6 ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>{message}</p>
//         )}

//         {/* Test Size Section */}
//         <div className="text-center mt-6">
//           <h2 className="text-xl font-semibold text-gray-700">Test Size: {testSize}</h2>
//           <button
//             onClick={() => setEditingSize(true)}
//             className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all"
//           >
//             Edit Test Size
//           </button>
//         </div>

//         {/* Render EditTestSizeForm when editingSize is true */}
//         {editingSize && (
//           <EditTestSizeForm
//             testSize={testSize}
//             sizeId={sizeId}
//             onClose={() => setEditingSize(false)}
//             onSizeUpdate={(newSize) => setTestSize(newSize)}
//           />
//         )}
//       </div>
//         </div>

//         {/* Edit Form */}
//         {editingMark && (
//           <form onSubmit={handleSubmit} className="mt-10 bg-white shadow rounded-lg p-6 max-w-md mx-auto">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Edit Mark</h2>
//             <div className="mb-4">
//               <label className="block text-gray-700 font-medium mb-2">Level:</label>
//               <p className="w-full p-2 border rounded bg-gray-100 text-gray-700">{form.level}</p>
//             </div>
//             <div className="mb-4">
//               <label className="block text-gray-700 font-medium mb-2">Time (mins):</label>
//               <input
//                 type="number"
//                 name="time"
//                 value={form.time}
//                 onChange={handleChange}
//                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-gray-700 font-medium mb-2">Marks:</label>
//               <input
//                 type="number"
//                 name="marks"
//                 value={form.marks}
//                 onChange={handleChange}
//                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
//                 required
//               />
//             </div>
//             <div className="flex justify-between">
//               <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-all">
//                 Save Changes
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setEditingMark(null)}
//                 className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </Layout>
//   );
// }



// // Protect the page with server-side authentication
// export async function getServerSideProps(context) {
//   const session = await getSession(context);

//   if (!session || session.user.role !== "admin") {
//     return {
//       redirect: {
//         destination: "/", // Replace with your sign-in page route
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       user: session.user, // Pass user data to the component
//     },
//   };
// }

// export default MarksPage;

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

  if (!session || session.user.role !== "admin") {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }

  return { props: { user: session.user } };
}

export default MarksPage;
