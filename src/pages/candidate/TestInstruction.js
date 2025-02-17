import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { FaCheckCircle, FaClock, FaArrowRight } from "react-icons/fa";
import { getSession } from "next-auth/react";

const TestInstruction = ({ user }) => {
    const router = useRouter();
    const [isButtonActive, setIsButtonActive] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsButtonActive(true);
        }, 10000); // 10 seconds delay
        //window.history.forward(); // Prevent user from going back to the previous page
        return () => clearTimeout(timer);
    }, []);

    const handleStartTest = () => {
        if (isButtonActive) {
            router.push("/candidate/TestModule"); // Change this to your actual test route
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-200 to-indigo-500 p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-3xl bg-white shadow-2xl rounded-lg p-8"
            >
                <h1 className="text-4xl font-bold text-gray-900 text-center mb-6">
                    📝 Test Instructions 
                </h1>

                {/* Instructions List */}
                <ul className="space-y-5 text-gray-800 text-lg">
                    {[  // List of instructions
                        "Once you click an answer, the test will move to the next question automatically.",
                        "You cannot go back to previously attempted questions.",
                        "Each question has a specific timer. If time runs out, the test will move to the next question.",
                        "Once you submit the test, you will not be able to access any questions again.",
                        "Do not refresh or close the tab while taking the test, as it may result in automatic submission.",
                        "Ensure a stable internet connection to avoid any interruptions during the test.",
                    ].map((instruction, index) => (
                        <motion.li
                            key={index}
                            className="flex items-start"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.2, duration: 0.5 }}
                        >
                            <FaCheckCircle className="text-green-500 mt-1 mr-3" />
                            {instruction}
                        </motion.li>
                    ))}
                </ul>

                {/* Timer Message */}
                {!isButtonActive && (
                    <div className="flex items-center justify-center mt-6 text-gray-700">
                        <FaClock className="text-xl animate-pulse mr-2" />
                        <p className="text-lg font-medium">Please wait.. Activating Start Button in 10 seconds</p>
                    </div>
                )}

                {/* Start Test Button */}
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleStartTest}
                        disabled={!isButtonActive}
                        className={`flex items-center gap-3 px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 ${isButtonActive
                            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                            : "bg-gray-400 text-gray-600 cursor-not-allowed"
                            }`}
                    >
                        Start Test <FaArrowRight />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// Protect the page with server-side authentication
export async function getServerSideProps(context) {
    const session = await getSession(context);

    if (!session || session.user.role !== "employee") {
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

export default TestInstruction;

