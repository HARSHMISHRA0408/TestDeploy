// pages/results.js
import { useEffect, useState } from 'react';
import Layout from './Layout';

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all results initially
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch('/api/results/getresult');
        const data = await res.json();
        if (data.success) {
          setResults(data.data);
          setFilteredResults(data.data);
        }
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };
    fetchResults();
  }, []);

  // Filter results by email based on search term
  useEffect(() => {
    setFilteredResults(
      results.filter(result =>
        result.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, results]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Quiz Results</h1>
      
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by email"
          className="border border-gray-300 p-3 w-full md:w-1/2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="text-left px-6 py-3 font-semibold uppercase tracking-wider">Email</th>
              <th className="text-left px-6 py-3 font-semibold uppercase tracking-wider">Scores</th>
              <th className="text-left px-6 py-3 font-semibold uppercase tracking-wider">Attempts</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.length > 0 ? (
              filteredResults.map((result) => (
                <tr key={result._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{result.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {result.scores.join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    <ul className="space-y-1">
                      {result.attempts.map((attempt) => (
                        <li key={attempt._id} className="text-gray-600">
                          <span className="font-medium">Score:</span> {attempt.score}, 
                          <span className="font-medium"> Date:</span> {new Date(attempt.date).toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">No results found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

ResultsPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};