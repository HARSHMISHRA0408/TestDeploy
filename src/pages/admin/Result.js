import { useEffect, useState } from 'react';
import Layout from './Layout';
import React from "react";
import { getSession, signOut } from "next-auth/react";



export default function ResultsPage({ user }) {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all results initially
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch('/api/results/getresult');
        const data = await res.json();
        if (data.success) {
          setResults(data.data);
          setFilteredResults(data.data);
        } else {
          setError('Failed to load results');
        }
      } catch (error) {
        setError('Error fetching results');
      } finally {
        setLoading(false);
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
    <Layout user={user}>
      <div className="container mx-auto px-4 py-1 max-w-7xl">
       

        {/* Search Input */}
        <div className="mb-6 flex justify-between">
        <h1 className="text-3xl font-semibold text-center text-gray-900 mb-4">Results</h1>
          <input
            type="text"
            placeholder="Search by email"
            className="border border-gray-300 p-2 w-full md:w-1/2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Loading & Error States */}
        {loading && (
          <div className="text-center text-gray-500 mb-4">Loading results...</div>
        )}

        {error && (
          <div className="text-center text-red-500 mb-4">{error}</div>
        )}

        {/* Results Section */}
        {!loading && !error && (
          <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
            {filteredResults.length > 0 ? (
              filteredResults.map((result) => (
                <div key={result._id} className="mb-6">
                  {/* Email Header */}
                  <div className="bg-blue-600 text-white p-2 ">
                    <h3 className="text-xl font-semibold">Email: {result.email}</h3>
                  </div>

                  {/* Attempts Table */}
                  <div className="bg-white rounded-b-lg p-2">
                    <table className="min-w-full">
                      <thead className="bg-gray-100 text-gray-600">
                        <tr>
                          <th className="text-left px-6 py-2   font-semibold text-sm">Score</th>
                          <th className="text-left px-6 py-2 font-semibold text-sm">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.attempts.length > 0 ? (
                          result.attempts.map((attempt) => (
                            <tr key={attempt._id} className="border-b hover:bg-gray-50">
                              <td className="px-6 py-4 text-gray-700">{attempt.score}</td>
                              <td className="px-6 py-4 text-gray-700">{new Date(attempt.date).toLocaleString()}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="2" className="px-6 py-4 text-center text-gray-500">No attempts available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">No results found</div>
            )}
          </div>
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
      redirect: {
        destination: "/testAuth", // Replace with your sign-in page route
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: session.user, // Pass user data to the component
    },
  };
}


