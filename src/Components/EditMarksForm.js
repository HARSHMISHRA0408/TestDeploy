import { useState } from "react";

function EditMarkForm({ mark, onClose, onMarkUpdate }) {
  const [form, setForm] = useState({ level: mark.level, time: mark.time, marks: mark.marks });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/marks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: mark._id, ...form }),
    });

    const data = await res.json();
    if (data.success) {
      setMessage("Mark updated successfully");
      onMarkUpdate();
      onClose();
    } else {
      setMessage("Failed to update mark");
    }
  };

  return (
    <div className="mt-10 bg-white shadow rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Edit Mark</h2>

      {message && (
        <p className={`text-center mb-4 ${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Level:</label>
          <p className="w-full p-2 border rounded bg-gray-100 text-gray-700">{form.level}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Time (mins):</label>
          <input
            type="number"
            name="time"
            value={form.time}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Marks:</label>
          <input
            type="number"
            name="marks"
            value={form.marks}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>
        <div className="flex justify-between">
          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-all">
            Save Changes
          </button>
          <button type="button" onClick={onClose} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditMarkForm;
