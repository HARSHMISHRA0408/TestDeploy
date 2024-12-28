import { useEffect, useState } from 'react';
import Layout from './CandidateLayout';

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Fetch the user's email from localStorage
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    setUserEmail(email);
  }, []);

  // Fetch results and filter by user's email
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch('/api/results/getresult');
        const data = await res.json();
        if (data.success) {
          const userResults = data.data.filter((result) => result.email === userEmail);
          setResults(userResults);
          setFilteredResults(userResults);
        }
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };
    if (userEmail) fetchResults();
  }, [userEmail]);

  // Filter results by email based on search term
  useEffect(() => {
    setFilteredResults(
      results.filter((result) =>
        result.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, results]);

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Your Quiz Results</h1>

      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by email"
          className="border border-gray-300 p-3 w-full md:w-1/2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">Email</th>
              {/* <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">Scores</th> */}
              <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">Attempts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredResults.length > 0 ? (
              filteredResults.map((result) => (
                <tr key={result._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">{result.email}</td>
                  {/* <td className="px-6 py-4 text-sm text-gray-700">{result.scores.join(', ')}</td> */}
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <ul className="space-y-1">
                      {result.attempts.map((attempt) => (
                        <li key={attempt._id} className="text-gray-600">
                          <span className="font-medium text-blue-600 p-3">Score:</span> {attempt.score},{' '}
                          <span className="font-medium text-blue-600 p-3">Date:</span>{' '}
                          {new Date(attempt.date).toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                  No results found for your account.
                </td>
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
