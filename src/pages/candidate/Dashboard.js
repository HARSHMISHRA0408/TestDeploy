import { useEffect, useState } from 'react';
import Layout from './CandidateLayout';

const Dashboard = () => {
  const [tokenData, setTokenData] = useState(null);

  useEffect(() => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');

    if (token) {
      try {
        // Decode the token's payload (JWT structure: header.payload.signature)
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decoding JWT payload
        setTokenData(decodedToken);
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    } else {
      console.warn('No token found in localStorage.');
    }
  }, []);

  return (
    <div className="p-8 bg-gray-100 max-h-screen">
     

      {/* Main Content */}
      <main>
        {tokenData ? (
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-blue-800 mb-6">Profile Information</h2>
            <table className="min-w-full bg-gray-50 rounded-lg overflow-hidden">
              {/* <thead>
                <tr className="bg-blue-700 text-white">
                  <th className="px-6 py-4 text-left font-medium">Data</th>
                  <th className="px-6 py-4 text-left font-medium">Value</th>
                </tr>
              </thead> */}
              <tbody>
                {Object.entries(tokenData).map(([key, value], index) => (
                  <tr
                    key={key}
                    className={`${
                      index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                    } hover:bg-gray-200`}
                  >
                    <td className="px-6 py-4 text-gray-800 font-medium capitalize">{key}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {typeof value === 'string' ? value : JSON.stringify(value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">No Data Found</h2>
            <p>Please log in to view your profile information.</p>
          </div>
        )}
      </main>
    </div>
  );
};

// Apply the layout to the Dashboard page
Dashboard.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default Dashboard;
