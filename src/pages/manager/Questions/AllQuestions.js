import { useRouter } from 'next/router';
import Layout from '../Layout'; // Adjust the path if needed
import { useState, useEffect } from 'react';

function AllQuestions({ initialQuestions = [] }) {
  const router = useRouter();
  const [questions, setQuestions] = useState(initialQuestions);

  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/questions/getQuestions');
      const data = await res.json();
      if (data.success) {
        setQuestions(data.data);
      } else {
        console.error('Failed to fetch questions');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  useEffect(() => {
    if (!initialQuestions.length) {
      fetchQuestions();
    }
  }, [initialQuestions]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>All Questions</h1>
      <button
        onClick={() => router.push('/admin/Questions/addQuestion')}
        style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}
      >
        Add Question
      </button>
      <div>
        {questions.length > 0 ? (
          questions.map((question) => (
            <div key={question._id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '5px' }}>
              <h3>{question.question}</h3>
              <p><strong>Category:</strong> {question.category}</p>
              <p><strong>Difficulty:</strong> {question.difficulty}</p>
              <button
                onClick={() => router.push(`/questions/edit/${question._id}`)}
                style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
              >
                Edit
              </button>
            </div>
          ))
        ) : (
          <p>No questions available.</p>
        )}
      </div>
    </div>
  );
}

// Apply layout to the AllQuestions page
AllQuestions.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default AllQuestions;
