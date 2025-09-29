import { useState, useEffect, useRef } from "react";
import React from "react";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useCallback } from "react";
//import feedbackForm from "./feedbackForm";

export default function Quiz({
  user,
  knowledgeAreaPara,
  categoryPara,
  testId,
}) {
  const [questions, setQuestions] = useState({
    easy: [],
    medium: [],
    hard: [],
  });
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentDifficulty, setCurrentDifficulty] = useState("easy");
  const [score, setScore] = useState(0);
  const [questionsAsked, setQuestionsAsked] = useState(1);
  const [testSize, setTestSize] = useState(0);
  const [error, setError] = useState(null);
  // MARKS AND TIME
  const [easyMarks, setEasyMarks] = useState(null);
  const [mediumMarks, setMediumMarks] = useState(null);
  const [hardMarks, setHardMarks] = useState(null);
  const [easyTime, setEasyTime] = useState(null);
  const [mediumTime, setMediumTime] = useState(null);
  const [hardTime, setHardTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [maxScore, setmaxScore] = useState(null);

  //tracking to create result dashboard
  const [easyCorrect, setEasyCorrect] = useState(0);
  const [mediumCorrect, setMediumCorrect] = useState(0);
  const [hardCorrect, setHardCorrect] = useState(0);
  const [easyIncorrect, setEasyIncorrect] = useState(0);
  const [mediumIncorrect, setMediumIncorrect] = useState(0);
  const [hardIncorrect, setHardIncorrect] = useState(0);

  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);
  const [feedback, setFeedback] = useState("");
  const askedQuestions = useRef(new Set());
  const consecutiveIncorrect = useRef(0);
  const email = user?.email;
  const knowledgeArea = knowledgeAreaPara;
  const category = categoryPara;
  const userId = user._id;

  //FETCHING MARKS AND TIME IN DIFFERENT LEVELS
  useEffect(() => {
    const fetchMarksAndTime = async () => {
      try {
        const response = await fetch("/api/marks");
        if (!response.ok)
          throw new Error(
            "Failed to fetch marks and time: " + response.statusText
          );

        const data = await response.json();
        if (!data?.data) throw new Error("Invalid response format.");
        console.log("Parsed response data:", data);

        // Process the data to set marks and time for each level
        const levels = data.data;

        const easyLevel = levels.find((level) => level.level === "easy");
        const mediumLevel = levels.find((level) => level.level === "medium");
        const hardLevel = levels.find((level) => level.level === "hard");

        if (easyLevel) {
          setEasyMarks(easyLevel.marks);
          setEasyTime(easyLevel.time * 60);
          setTimeLeft(easyLevel.time * 60);
        }
        if (mediumLevel) {
          setMediumMarks(mediumLevel.marks);
          setMediumTime(mediumLevel.time * 60);
        }
        if (hardLevel) {
          setHardMarks(hardLevel.marks);
          setHardTime(hardLevel.time * 60);
        }
      } catch (error) {
        console.error("Error fetching marks and time:", error);
      }
    };

    fetchMarksAndTime();
  }, []);

  /////////////////////////////////////////test sizeee
  useEffect(() => {
    const fetchTestSize = async () => {
      try {
        const response = await fetch("/api/tests/testSize");
        const data = await response.json();
        setTestSize(data.testSizes[0].size);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchTestSize();
  }, []);

  useEffect(() => {
    setmaxScore(easyMarks + mediumMarks + (testSize - 2) * hardMarks);
  }, [easyMarks, mediumMarks, hardMarks, testSize]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log("Fetching questions from the API...");
        const response = await fetch("/api/questions/getQuestions");
        if (!response.ok)
          throw new Error("Failed to fetch questions: " + response.statusText);

        const data = await response.json();

        if (!data?.data) throw new Error("Invalid response format.");

        const allQuestions = data.data;

        const filteredQuestions = allQuestions.filter(
          (q) =>
            (!knowledgeArea || q.knowledge_area === knowledgeArea) &&
            (!category || q.category === category)
        );
        //console.log("Filtered questions count:", filteredQuestions.length);

        // Divide questions by difficulty
        const easy = filteredQuestions.filter(
          (q) => q.difficulty.toLowerCase() === "easy"
        );
        const medium = filteredQuestions.filter(
          (q) => q.difficulty.toLowerCase() === "medium"
        );
        const hard = filteredQuestions.filter(
          (q) => q.difficulty.toLowerCase() === "hard"
        );

        setQuestions({ easy, medium, hard });

        // Set the first question
        const firstEasy = easy[0];
        if (firstEasy) {
          setCurrentQuestion(firstEasy);
          askedQuestions.current.add(firstEasy._id || firstEasy.question); // Unique identifier
        } else {
          console.log(
            "No easy questions found to set as the current question."
          );
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    // Fetch questions only if token data is available
    if (knowledgeArea && category) {
      console.log("Token data available. Proceeding to fetch questions.");
      fetchQuestions();
    } else {
      console.log("Token data not available. Skipping question fetch.");
    }
  }, [knowledgeArea, category]);

  const submitResults = useCallback(async () => {
    try {
      const response = await fetch("/api/results/saveresult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          score,
          knowledgeArea,
          easyCorrect,
          easyIncorrect,
          mediumCorrect,
          mediumIncorrect,
          hardCorrect,
          hardIncorrect,
          maxScore,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Result saved successfully!");

        // Update user's test status
        const updateResponse = await fetch("/api/tests/testUpdate", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, testId, permission: "notallowed" }),
        });

        const updateData = await updateResponse.json();

        if (updateData.success) {
          alert("User's test status updated to 'notallowed'.");
        } else {
          alert(updateData.message || "Failed to update user's test status.");
        }
      } else {
        alert(data.message || "Failed to save the quiz result.");
      }
    } catch (error) {
      alert("Error saving result: " + error.message);
    } finally {
      setIsQuizComplete(true);
    }
  }, [
    email,
    score,
    knowledgeArea,
    easyCorrect,
    easyIncorrect,
    mediumCorrect,
    mediumIncorrect,
    hardCorrect,
    hardIncorrect,
    maxScore,
    userId,
    testId,
    setIsQuizComplete,
  ]);

  const getNextQuestion = useCallback(
    (difficulty) => {
      const difficultyArray = questions[difficulty];
      return difficultyArray.find(
        (q) => !askedQuestions.current.has(q._id || q.question)
      );
    },
    [questions]
  );

  const handleNextQuestion = useCallback(
    (isCorrect) => {
      setQuestionsAsked((prev) => prev + 1);

      if (questionsAsked >= testSize) {
        submitResults();
        setIsQuizComplete(true);
        return;
      }

      let nextDifficulty = currentDifficulty;

      if (!isCorrect && consecutiveIncorrect.current >= 3) {
        if (currentDifficulty === "medium") {
          nextDifficulty = "easy";
        } else if (currentDifficulty === "hard") {
          nextDifficulty = "medium";
        }
        consecutiveIncorrect.current = 0;
      } else if (isCorrect) {
        if (currentDifficulty === "easy" && questions.medium.length > 0) {
          nextDifficulty = "medium";
        } else if (
          currentDifficulty === "medium" &&
          questions.hard.length > 0
        ) {
          nextDifficulty = "hard";
        }
      }

      let nextQuestion = getNextQuestion(nextDifficulty);

      if (!nextQuestion) {
        nextQuestion = getNextQuestion(currentDifficulty);
      }

      if (nextQuestion) {
        setCurrentQuestion(nextQuestion);
        setCurrentDifficulty(nextDifficulty);
        setTimeLeft(
          nextDifficulty === "easy"
            ? easyTime
            : nextDifficulty === "medium"
            ? mediumTime
            : hardTime
        );
        askedQuestions.current.add(nextQuestion._id || nextQuestion.question);
      } else {
        setIsQuizComplete(true);
      }
    },
    [
      questionsAsked,
      testSize,
      currentDifficulty,
      questions,
      easyTime,
      mediumTime,
      hardTime,
      getNextQuestion,
      submitResults,
    ]
  );

  useEffect(() => {
    if (!currentQuestion || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, timeLeft]);

  // 2. Handle when time runs out
  useEffect(() => {
    if (timeLeft !== 0) return;

    if (questionsAsked  >= testSize) {
      if (currentDifficulty === "easy") {
        setEasyIncorrect((prev) => prev + 1);
      } else if (currentDifficulty === "medium") {
        setMediumIncorrect((prev) => prev + 1);
      } else if (currentDifficulty === "hard") {
        setHardIncorrect((prev) => prev + 1);
      }

      setIsQuizComplete(true);
      submitResults();
    } else {
      handleNextQuestion(false);
      if (currentDifficulty === "easy") {
        setEasyIncorrect((prev) => prev + 1);
      } else if (currentDifficulty === "medium") {
        setMediumIncorrect((prev) => prev + 1);
      } else if (currentDifficulty === "hard") {
        setHardIncorrect((prev) => prev + 1);
      }
    }
  }, [timeLeft]);

  const handleAnswer = (optionText) => {
    // const isCorrect = optionText === currentQuestion.correct_option;
    const isCorrect =
      optionText.trim().toLowerCase() ===
      currentQuestion.correct_option.trim().toLowerCase();

    if (isCorrect) {
      // Increment score based on difficulty level
      const marks =
        currentDifficulty === "easy"
          ? easyMarks
          : currentDifficulty === "medium"
          ? mediumMarks
          : hardMarks; // 3 for hard
      setScore((prev) => prev + marks);
      consecutiveIncorrect.current = 0; // Reset counter on correct answer

      // Update correct answers count based on difficulty
      if (currentDifficulty === "easy") {
        setEasyCorrect((prev) => prev + 1);
      } else if (currentDifficulty === "medium") {
        setMediumCorrect((prev) => prev + 1);
      } else if (currentDifficulty === "hard") {
        setHardCorrect((prev) => prev + 1);
      }
    } else {
      // Increment incorrect answers count based on difficulty
      if (currentDifficulty === "easy") {
        setEasyIncorrect((prev) => prev + 1);
      } else if (currentDifficulty === "medium") {
        setMediumIncorrect((prev) => prev + 1);
      } else if (currentDifficulty === "hard") {
        setHardIncorrect((prev) => prev + 1);
      }

      consecutiveIncorrect.current += 1;
    }

    handleNextQuestion(isCorrect);
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Error: User not logged in.");
      return;
    }

    try {
      const response = await fetch("/api/feedback/savefeedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, feedback }),
      });

      const data = await response.json();
      if (data.success) {
        setIsFeedbackSubmitted(true);
        alert("Feedback submitted successfully!");
        //router.push("/candidate/TestModule");
      } else {
        alert("Error submitting feedback.");
      }
    } catch (error) {
      alert("Error submitting feedback: " + error.message);
    }
  };

  return (
    <div className="quiz-container mx-auto mt-10 max-w-3xl bg-white shadow-lg rounded-lg p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Quiz
      </h1>
      {!isQuizComplete ? (
        currentQuestion ? (
          <>
            <div className="mb-4">
              <p className="text-lg font-medium text-gray-700">
                Score: <span className="font-bold">{score}</span>
              </p>
              <p className="text-lg font-medium text-gray-700">
                Incorrect: <span className="font-bold">{easyIncorrect}</span>
              </p>
              <p className="text-lg font-medium text-gray-700">
                Time left: <span className="font-bold">{timeLeft}s</span>
              </p>
              <p className="text-lg font-medium text-gray-700">
                Difficulty:{" "}
                <span className="font-bold">{currentDifficulty}</span>
              </p>
              <p className="text-lg font-medium text-gray-700">
                Questions Asked:{" "}
                <span className="font-bold">{questionsAsked}</span>
              </p>
            </div>

            <div className="mb-6">
              <p className="text-xl font-semibold text-gray-900">
                {currentQuestion.question}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.text)}
                  className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow transition duration-200"
                >
                  {option.text}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => handleNextQuestion(false)}
                className="py-2 px-6 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg shadow transition duration-200"
              >
                Next
              </button>
              <button
                onClick={submitResults}
                className="py-2 px-6 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow transition duration-200"
              >
                Submit
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-lg text-gray-500">
            Loading question...
          </p>
        )
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Quiz Complete!
          </h2>
          <p className="text-lg font-medium text-gray-700 mb-4">
            Your Score: <span className="font-bold">{score}</span>
          </p>

          {!isFeedbackSubmitted ? (
            <form onSubmit={handleFeedbackSubmit} className="mt-4">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full border p-2 rounded mb-4"
                rows="4"
                placeholder="Share your feedback..."
                required
              />
              <button
                type="submit"
                disabled={!feedback.trim()} // Disable if only spaces
                className={`py-2 px-6 font-bold rounded-lg shadow transition duration-200 ${
                  feedback.trim()
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Submit Feedback
              </button>
            </form>
          ) : (
            <div>
              <p className="text-green-600 font-medium">
                Thank you for your feedback!
              </p>
              <br />
              <Link
                href="/candidate/TestInstruction"
                className=" px-6 py-3 bg-green-400 rounded-lg hover:bg-orange-400 text-left transition m-3"
              >
                Take Pending Tests
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Protect the page with server-side authentication
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session || session.user.role !== "employee") {
    return {
      redirect: {
        destination: "/", // Replace with your sign-in page route
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
