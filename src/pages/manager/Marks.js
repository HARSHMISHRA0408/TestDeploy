import { useState, useEffect } from 'react';
import Layout from "./Layout";

function MarksPage() {
  const [marks, setMarks] = useState([]);
  const [editingMark, setEditingMark] = useState(null);
  const [form, setForm] = useState({
    level: 'easy',
    time: '',
    marks: '',
  });
  const [message, setMessage] = useState('');

  // Fetch marks on component mount
  const fetchMarks = async () => {
    const res = await fetch('/api/marks');
    const data = await res.json();
    if (data.success) setMarks(data.data);
  };

  useEffect(() => {
    fetchMarks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (mark) => {
    setEditingMark(mark._id);
    setForm({
      level: mark.level,
      time: mark.time,
      marks: mark.marks,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = 'PUT';
    const endpoint = '/api/marks';

    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingMark, ...form }),
    });
    const data = await res.json();

    if (data.success) {
      setMessage('Mark updated successfully');
      setEditingMark(null);
      setForm({ level: 'easy', time: '', marks: '' });
      fetchMarks();
    } else {
      setMessage('Failed to save mark');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Manage Marks</h1>

      {message && <p className="text-green-600 mb-4">{message}</p>}

      {/* Marks List */}
      <div className="space-y-4">
        {marks.map((mark) => (
          <div key={mark._id} className="border p-4 rounded-lg flex justify-between items-center">
            <div>
              <p><strong>Level:</strong> {mark.level}</p>
              <p><strong>Time:</strong> {mark.time}</p>
              <p><strong>Marks:</strong> {mark.marks}</p>
            </div>
            <button
              onClick={() => handleEdit(mark)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* Edit Form */}
      {editingMark && (
        <form onSubmit={handleSubmit} className="mt-8 p-4 border rounded-lg">
          <h2 className="text-xl font-bold mb-4">Edit Mark</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Level:</label>
            <p className="w-full p-2 border rounded bg-gray-100">{form.level}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Time:</label>
            <input
              type="number"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Marks:</label>
            <input
              type="number"
              name="marks"
              value={form.marks}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => setEditingMark(null)}
            className="ml-2 bg-red-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}

MarksPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default MarksPage;
