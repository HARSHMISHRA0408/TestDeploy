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
    <div className="container mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Manage Marks</h1>

      {message && (
        <p className={`text-center mb-6 ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>{message}</p>
      )}

      {/* Marks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {marks.map((mark) => (
          <div key={mark._id} className="bg-white shadow rounded-lg p-6 flex flex-col justify-between">
            <div>
              <p className="text-lg font-semibold text-gray-700 mb-2">Level: <span className="text-gray-800">{mark.level}</span></p>
              <p className="text-gray-600 mb-1">Time: <span className="font-medium text-gray-800">{mark.time} mins</span></p>
              <p className="text-gray-600">Marks: <span className="font-medium text-gray-800">{mark.marks}</span></p>
            </div>
            <button
              onClick={() => handleEdit(mark)}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* Edit Form */}
      {editingMark && (
        <form onSubmit={handleSubmit} className="mt-10 bg-white shadow rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Edit Mark</h2>
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
            <button
              type="button"
              onClick={() => setEditingMark(null)}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

MarksPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default MarksPage;
