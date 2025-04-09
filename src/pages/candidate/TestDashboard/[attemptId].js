import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// Dynamically import charts
const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), { ssr: false });
const Pie = dynamic(() => import("react-chartjs-2").then((mod) => mod.Pie), { ssr: false });

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from "chart.js";
import Link from "next/link";

// Register ChartJS components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

const AttemptDashboard = () => {
  const router = useRouter();
  const { attemptId } = router.query;
  const [attempt, setAttempt] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!attemptId) return;

    const fetchAttempt = async () => {
      try {
        const res = await fetch("/api/results/getresult");
        const data = await res.json();

        if (data.success) {
          let foundAttempt = null;
          data.data.forEach((user) => {
            const attempt = user.attempts.find((a) => a._id === attemptId);
            if (attempt) {
              foundAttempt = attempt;
            }
          });

          if (foundAttempt) {
            setAttempt(foundAttempt);

            // Process Data for Charts
            const {
              score,
              easyCorrect,
              easyIncorrect,
              mediumCorrect,
              mediumIncorrect,
              hardCorrect,
              hardIncorrect,
              questionsAsked,
              date,
            } = foundAttempt;

            setChartData({
              pieData: {
                labels: ["Correct", "Incorrect"],
                datasets: [
                  {
                    data: [easyCorrect + mediumCorrect + hardCorrect, easyIncorrect + mediumIncorrect + hardIncorrect],
                    backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
                  },
                ],
              },
              barData: {
                labels: ["Easy", "Medium", "Hard"],
                datasets: [
                  {
                    label: "Correct",
                    data: [easyCorrect, mediumCorrect, hardCorrect],
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                  },
                  {
                    label: "Incorrect",
                    data: [easyIncorrect, mediumIncorrect, hardIncorrect],
                    backgroundColor: "rgba(255, 99, 132, 0.6)",
                  },
                ],
              },
              formattedDate: new Date(date).toLocaleString(),
            });
          } else {
            console.error("Attempt not found");
          }
        }
      } catch (error) {
        console.error("Error fetching attempt:", error);
      }
    };

    fetchAttempt();
  }, [attemptId]);

  if (!attempt || !chartData) return <p className="text-center text-xl">Loading...</p>;

  return (
    <div className="h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg p-6">
        <div className="flex align-middle justify-between">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Test Result Dashboard</h1>
          <Link href= "/candidate/UserResult" >✖️</Link>
        </div>

        {/* Score & Date Section */}
        <div className="flex justify-evenly grid-cols-2 gap-4 md:grid-cols-3 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg text-center shadow-sm">
            <p className="text-lg text-gray-700">Total Score</p>
<<<<<<< HEAD
            <p className="text-2xl font-bold text-gray-900 flex items-baseline gap-1">
              <span className="text-3xl">{attempt.score}</span>
              <span className="text-xl">/ {attempt.maxScore}</span>
            </p>
            
=======
            <p className="text-2xl font-bold text-gray-900">{attempt.score}</p>
>>>>>>> e5dd2ba35305ffd9782cea154391c3b5ae847a35
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center shadow-sm col-span-2 md:col-span-1">
            <p className="text-lg text-gray-700">Date</p>
            <p className="text-lg font-semibold text-gray-800">{chartData.formattedDate || "Loading..."}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm h-[300px] overflow-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Correct vs Incorrect Answers</h2>
            <Bar data={chartData.barData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm h-[300px] overflow-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Overall Performance</h2>
            <Pie data={chartData.pieData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Questions Asked Section */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          
            <div  className="bg-gray-50 p-4 rounded-lg text-center shadow-sm">
              <p className="text-lg font-medium text-gray-700 capitalize">Easy</p>
              <p className="text-2xl font-bold text-gray-900">{attempt.easyCorrect+attempt.easyIncorrect}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center shadow-sm">
              <p className="text-lg font-medium text-gray-700 capitalize">Medium</p>
              <p className="text-2xl font-bold text-gray-900">{attempt.mediumCorrect + attempt.mediumIncorrect}</p>
            </div>
            <div  className="bg-gray-50 p-4 rounded-lg text-center shadow-sm">
              <p className="text-lg font-medium text-gray-700 capitalize">Hard</p>
              <p className="text-2xl font-bold text-gray-900">{attempt.hardCorrect + attempt.hardIncorrect}</p>
            </div>
        
        </div>

        {/* Correct / Incorrect Answer Icons */}
        {/* <div className="flex justify-around mt-6">
          <div className="flex items-center space-x-2">
            <FaCheckCircle className="text-green-500 text-2xl" />
            <p className="text-lg text-gray-700">Correct Answers</p>
          </div>
          <div className="flex items-center space-x-2">
            <FaTimesCircle className="text-red-500 text-2xl" />
            <p className="text-lg text-gray-700">Incorrect Answers</p>
          </div>
          <Link href= "#" >✖️</Link>
        </div> */}
      </div>
    </div>
  );
};

export default AttemptDashboard;
