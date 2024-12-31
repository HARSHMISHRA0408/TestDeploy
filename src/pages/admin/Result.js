import { useEffect, useState } from 'react';
import Layout from './Layout';
import { parse } from "cookie";
import jwt from "jsonwebtoken";


// Server-side authentication to restrict access to admin users
export async function getServerSideProps({ req }) {
  const redirectToLogin = {
    redirect: {
      destination: "/auth/Login",
      permanent: false,
    },
  };

  try {
    // Parse cookies manually to ensure proper extraction
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.token;

    // Redirect if token is missing
    if (!token || token.trim() === "") {
      console.error("No token found in cookies");
      return redirectToLogin;
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the role is "manager"
    if (decoded.role !== "admin") {
      console.error(`Unauthorized role: ${decoded.role}`);
      return redirectToLogin;
    }

    // Token is valid, and role is "manager"
    return {
      props: {
        user: decoded, // Pass decoded user info if needed
      },
    };
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return redirectToLogin;
  }
}


export default function ResultsPage() {
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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-4xl font-semibold text-center text-gray-900 mb-6">Quiz Results</h1>

      {/* Search Input */}
      <div className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="Search by email"
          className="border border-gray-300 p-4 w-full md:w-1/2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                  <h3 className="text-xl font-semibold">Email: {result.email}</h3>
                </div>

                {/* Attempts Table */}
                <div className="bg-white rounded-b-lg p-4">
                  <table className="min-w-full">
                    <thead className="bg-gray-100 text-gray-600">
                      <tr>
                        <th className="text-left px-6 py-3 font-semibold text-sm">Score</th>
                        <th className="text-left px-6 py-3 font-semibold text-sm">Date</th>
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
  );
}

ResultsPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
