import { useEffect, useState } from 'react';
import React from 'react';
import { getSession } from 'next-auth/react';
import Layout from './CandidateLayout';
import Link from 'next/link';

export default function ResultsPage({ user }) {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userEmail = user?.email;

  // Fetch results and filter by user's email
  useEffect(() => {
    const fetchResults = async () => {
      if (!userEmail) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/results/getresult');
        const data = await res.json();

        if (data.success) {
          const userResults = data.data.filter((result) => result.email === userEmail);
          setResults(userResults);
          setFilteredResults(userResults);
        } else {
          setError('Failed to fetch results. Please try again later.');
        }
      } catch (err) {
        setError('An error occurred while fetching results.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [userEmail]);

  // Filter results by search term
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilteredResults(
        results.filter((result) =>
          result.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }, 300); // Debounced for better performance

    return () => clearTimeout(timeoutId);
  }, [searchTerm, results]);

  return (
    <Layout user={user}>
      <div className="container mx-auto px-6 py-1">
        {/* <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Your Quiz Results</h1> */}

        {/* Search Bar */}
        {/* <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search by email"
            className="border border-gray-300 p-3 w-full md:w-1/2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search by email"
          />
        </div> */}

        {/* Loading/Error State */}
        {loading && (
          <p className="text-center text-gray-500">Loading results...</p>
        )}
        {error && (
          <p className="text-center text-red-500">{error}</p>
        )}

        {/* Results Table */}
        {!loading && !error && (
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg ">
            <table className="min-w-full divide-y divide-gray-200 ">
              <thead className="bg-blue-600 text-white ">
                <tr  >
                  <th className="px-6 py-4  text-sm font-medium uppercase tracking-wider text-center">
                    Attempts
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredResults.length > 0 ? (
                  filteredResults.map((result) => (
                    <tr key={result._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <ul className="space-y-1">
                          {result.attempts.map((attempt) => (
                            <Link key={attempt._id} href={`/candidate/TestDashboard/${attempt._id}`}>
                              <li className="text-gray-600 m-1 border border-gray-300 p-4 rounded-lg flex flex-wrap justify-around">
                                <div>
                                  <span className="font-medium text-blue-600">Score:</span>{' '}
                                  {attempt.score},{' '}
                                  <span className="font-medium text-blue-600">Date:</span>{' '}
                                  {new Date(attempt.date).toLocaleString()}
                                </div>
                                <div>
                                  <span className="font-medium text-blue-600">Result Dashboard 🎯</span>{' '}
                                </div>
                              </li>
                            </Link>
                          ))}
                        </ul>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="2"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No results found for your account.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

// Protect the page with server-side authentication
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/', // Replace with your sign-in page route
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

// ResultsPage.getLayout = function getLayout(page) {
//   return <Layout>{page}</Layout>;
// };
