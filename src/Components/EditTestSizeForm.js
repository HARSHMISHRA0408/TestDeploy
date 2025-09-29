// import { useState } from 'react';

// function EditTestSizeForm({ testSize, sizeId, onClose, onSizeUpdate }) {
//   const [newSize, setNewSize] = useState(testSize);
//   const [message, setMessage] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const res = await fetch('/api/tests/testSize', {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ id: sizeId, size: newSize }),
//     });

//     const data = await res.json();

//     if (data.success) {
//       setMessage('Test size updated successfully');
//       onSizeUpdate(newSize); // Update parent state
//       onClose(); // Close the form
//     } else {
//       setMessage('Failed to update test size');
//     }
//   };

//   return (
//     <div className="mt-10 bg-white shadow rounded-lg p-6 max-w-md mx-auto">
//       <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Edit Test Size</h2>

//       {message && <p className={`text-center mb-4 ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}

//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">Test Size:</label>
//           <input
//             type="number"
//             value={newSize}
//             onChange={(e) => setNewSize(e.target.value)}
//             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
//             required
//           />
//         </div>

//         <div className="flex justify-between">
//           <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-all">
//             Save Changes
//           </button>
//           <button
//             type="button"
//             onClick={onClose}
//             className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default EditTestSizeForm;

import { useState } from "react";

function EditTestSizeForm({ testSize, sizeId, onClose, onSizeUpdate }) {
  const [newSize, setNewSize] = useState(testSize);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/tests/testSize", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: sizeId, size: newSize }),
    });

    const data = await res.json();

    if (data.success) {
      setMessage("Test size updated successfully");
      onSizeUpdate(newSize);
      onClose();
    } else {
      setMessage("Failed to update test size");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Edit Test Size
        </h2>

        {message && (
          <p
            className={`text-center mb-4 ${
              message.includes("successfully")
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Test Size:
            </label>
            <input
              type="number"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-all"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTestSizeForm;
