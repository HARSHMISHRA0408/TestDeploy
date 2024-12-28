import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function UpdateUserDetails() {
  const [name, setName] = useState("");
  const [knowledgeArea, setKnowledgeArea] = useState("");
  const [category, setCategory] = useState("");
  const [role, setRole] = useState("employee");
  const [test, setTest] = useState("allowed");
  const router = useRouter();

  useEffect(() => {
    // Fetch the current user's details (you could also store this in global state)
    const user = JSON.parse(localStorage.getItem("userDetails"));
    if (user) {
      setName(user.name);
      setKnowledgeArea(user.knowledgeArea);
      setCategory(user.category);
      setRole(user.role);
      setTest(user.test);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");  // Assuming the token is stored in localStorage
    if (!token) {
      alert("You are not logged in.");
      return;
    }

    const response = await fetch("/api/testupdate", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Pass token in Authorization header
      },
      body: JSON.stringify({ email: localStorage.getItem("userEmail"), name, knowledgeArea, category, role, test }),
    });

    const data = await response.json();
    if (data.success) {
      alert("User details updated successfully.");
      router.push("/dashboard"); // Redirect to a dashboard or any page after update
    } else {
      alert(data.message || "Error updating user details.");
    }
  };

  return (
    <div>
      <h2>Update Your Details</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="text"
          value={knowledgeArea}
          onChange={(e) => setKnowledgeArea(e.target.value)}
          placeholder="Knowledge Area"
          required
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
        </select>
        <select value={test} onChange={(e) => setTest(e.target.value)}>
          <option value="allowed">Allowed</option>
          <option value="pending">Pending</option>
          <option value="notallowed">Not Allowed</option>
          <option value="rejected">Rejected</option>
        </select>
        <button type="submit">Update Details</button>
      </form>
    </div>
  );
}
