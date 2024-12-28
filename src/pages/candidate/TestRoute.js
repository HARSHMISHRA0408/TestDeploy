//check and divert user to significant page on clicking on quiz
//allowed > quiz
//not allowed > permission page

import { useEffect } from "react";
import { useRouter } from "next/router";

const CheckTestPermission = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("User not logged in. Redirecting to login page.");
      router.push("/auth/Login");
      return;
    }

    // Fetch the test status from the server
    fetch("/api/test-status", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Pass JWT token in Authorization header
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log(data.testStatus);
          if (data.testStatus === "allowed") {
            router.push("/quiz/Quiz"); // Redirect to the quiz if allowed
          }  if (data.testStatus === "notallowed") {
            router.push("/candidate/TestPermission"); // Redirect to the request permission page if not allowed
          }  if (data.testStatus === "pending") {
            router.push("/quiz/Quiz"); // Redirect to the request permission page if not allowed
          }  if (data.testStatus === "rejected") {
            router.push("/candidate/TestPermission"); // Redirect to the request permission page if not allowed
          }
        } else {
          alert(data.message || "Failed to check test status.");
          router.push("/auth/Login");
        }
      })
      .catch((error) => {
        console.error("Error checking test status:", error);
        alert("An error occurred. Please log in again.");
        router.push("/auth/Login");
      });
  }, [router]);

  return null; // Render nothing while waiting for the redirect
};

export default CheckTestPermission;
