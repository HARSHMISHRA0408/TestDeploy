const BASE_URL = "/api/tests/testSize"; // API endpoint

// Function to fetch test sizes
export const fetchTestSizes = async () => {
  try {
    const response = await fetch(BASE_URL, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Error fetching test sizes: ${response.statusText}`);
    }

    return await response.json(); // Return JSON data
  } catch (error) {
    console.error("Error fetching test sizes:", error);
    return { success: false, message: "Failed to fetch test sizes" };
  }
};
