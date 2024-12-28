import { useEffect, useState } from "react";
import Layout from "./Layout";

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFeedbacks() {
      try {
        const response = await fetch(
          "/api/feedback/getfeedbacks"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch feedbacks");
        }
        const result = await response.json();
        setFeedbacks(result.data || []); // Use empty array as fallback
      } catch (err) {
        setError(err.message);
      }
    }

    fetchFeedbacks();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-6 flex justify-center items-center">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          User Feedbacks
        </h1>
        {error ? (
          <p className="text-red-500 text-center">Error: {error}</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {feedbacks.length === 0 ? (
              <p className="text-gray-600 text-center">
                No feedbacks available
              </p>
            ) : (
              feedbacks.map((feedback) => (
                <div
                  key={feedback._id}
                  className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6"
                >
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    Feedback
                  </h2>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">Submitted At:</span>
                    <span className="text-sm text-gray-800 font-medium">
                      {new Date(feedback.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mb-4">
                    <span className="text-sm text-gray-600">Email:</span>
                    <p className="text-gray-800 font-medium">
                      {feedback.email}
                    </p>
                  </div>
                  <div className="mb-4">
                    <span className="text-sm text-gray-600">Feedback:</span>
                    <p className="text-gray-800 font-medium">
                      {feedback.feedback}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

FeedbackPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
