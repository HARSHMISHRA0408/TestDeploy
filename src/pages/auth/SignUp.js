// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { useRouter } from "next/router";

// function SignUp() {
//   const router = useRouter();
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [knowledgeArea, setKnowledgeArea] = useState(""); // State for knowledge area
//   const [category, setCategory] = useState(""); // State for category
//   const [error, setError] = useState("");
//   const [knowledgeAreas, setKnowledgeAreas] = useState([]); // Initialize as an empty array
//   const [categories, setCategories] = useState([]);

//   // Fetch knowledge areas and categories from the API
//   // Fetch knowledge areas and categories from the API
//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const response = await fetch("/api/knowledgeAreas");
//         const result = await response.json();

//         if (result.success && Array.isArray(result.data)) {
//           setKnowledgeAreas(result.data); // Use the data array directly
//         } else {
//           console.error("Unexpected data format:", result);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     }

//     fetchData();
//   }, []);

//   // Update categories when the knowledge area changes
//   useEffect(() => {
//     if (knowledgeArea) {
//       const selectedArea = knowledgeAreas.find(
//         (area) => area.name === knowledgeArea
//       );
//       setCategories(selectedArea ? selectedArea.categories : []);
//     } else {
//       setCategories([]);
//     }
//   }, [knowledgeArea, knowledgeAreas]);

//   const handleOptionChange = (index, value) => {
//     const newOptions = [...options];
//     newOptions[index] = value;
//     setOptions(newOptions);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!name || !email || !password || !knowledgeArea || !category) {
//       setError("Please fill in all fields.");
//       return;
//     }
//     setError("");
//     console.log("Name:", name);
//     console.log("Email:", email);
//     console.log("Password:", password);
//     console.log("Knowledge Area:", knowledgeArea);
//     console.log("Category:", category);
//     //handling form submission or API call here

//     const response = await fetch("/api/userSignUp", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         name: name,
//         email: email,
//         password: password,
//         knowledgeArea: knowledgeArea,
//         category: category,
//       }),
//     });

//     const res = await response.json();
//     if (res.success) {
//       localStorage.setItem("token", res.token);
//       localStorage.setItem("userEmail", email);
//       router.push("/candidate/Dashboard");
//     }

//     // const handlechange =(e)=>{

//     // }
//   };

//   return (
//     <div
//       className="flex items-center justify-center h-screen"
//       style={{ backgroundColor: "#fdf5f3" }}
//     >
//       <div className="flex rounded-lg overflow-hidden shadow-lg bg-white w-3/4 h-[600px] p-6">
//         {" "}
//         {/* Adjusted width */}
//         <div className="flex items-center justify-center w-1/2 bg-white">
//           <Image
//             src="/login.svg" // Update with the correct image path
//             alt="Company Logo"
//             layout="responsive" // Use responsive layout for scaling
//             width={200} // Specify width for the image
//             height={200} // Specify height for the image
//             className="object-contain p-4" // Adjust object-fit property
//           />
//         </div>
//         <div className="flex items-center justify-center w-1/2 p-6">
//           {" "}
//           {/* Centering the form */}
//           <form className="flex flex-col w-full" onSubmit={handleSubmit}>
//             <h2 className="text-2xl font-semibold mb-6 text-center">
//               Register
//             </h2>
//             {error && (
//               <div className="mb-4 text-red-500 text-center">{error}</div>
//             )}
//             <div className="mb-4">
//               <label htmlFor="name" className="block text-gray-700">
//                 Name:
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//                 className="w-full p-2 border border-gray-300 rounded"
//               />
//             </div>
//             <div className="mb-4">
//               <label htmlFor="email" className="block text-gray-700">
//                 Email:
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="w-full p-2 border border-gray-300 rounded"
//               />
//             </div>
//             <div className="mb-4">
//               <label htmlFor="password" className="block text-gray-700">
//                 Password:
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="w-full p-2 border border-gray-300 rounded"
//               />
//             </div>

//             {/* Knowledge Area dropdown */}
//             <div>
//               <label className="block text-gray-700 font-bold mb-2">
//                 Knowledge Area:
//               </label>
//               <select
//                 value={knowledgeArea}
//                 onChange={(e) => setKnowledgeArea(e.target.value)}
//                 required
//                 className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//               >
//                 <option value="" disabled>
//                   Select Knowledge Area
//                 </option>
//                 {knowledgeAreas.map((area) => (
//                   <option key={area._id} value={area.name}>
//                     {area.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Category dropdown */}
//             <div className="m-3">
//               <label className="block text-gray-700 font-bold mb-2">
//                 Category:
//               </label>
//               <select
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//                 required
//                 className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//               >
//                 <option value="" disabled>
//                   Select Category
//                 </option>
//                 {categories.map((cat) => (
//                   <option key={cat._id || cat.name} value={cat.name}>
//                     {cat.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <button
//               type="submit"
//               className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
//             >
//               Register
//             </button>
//             <div className="mt-4 text-center">
//               <p>
//                 Already have an account?{" "}
//                 <Link
//                   href="/auth/Login"
//                   className="text-blue-500 hover:underline"
//                 >
//                   Login here
//                 </Link>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SignUp;

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

function SignUp() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [knowledgeArea, setKnowledgeArea] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [knowledgeAreas, setKnowledgeAreas] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/knowledgeAreas");
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          setKnowledgeAreas(result.data);
        } else {
          console.error("Unexpected data format:", result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (knowledgeArea) {
      const selectedArea = knowledgeAreas.find(
        (area) => area.name === knowledgeArea
      );
      setCategories(selectedArea ? selectedArea.categories : []);
    } else {
      setCategories([]);
    }
  }, [knowledgeArea, knowledgeAreas]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !knowledgeArea || !category) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true); // Set loading to true

    try {
      const response = await fetch("/api/userSignUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          knowledgeArea,
          category,
        }),
      });

      const res = await response.json();
      if (res.success) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("userEmail", email);
        router.push("/candidate/Dashboard");
      } else {
        setError("Sign-up failed. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen"
      style={{ backgroundColor: "#fdf5f3" }}
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          <div className="loader border-t-4 border-blue-500 border-solid rounded-full w-12 h-12 animate-spin"></div>
          <p className="mt-4 text-blue-500">Registering your account...</p>
        </div>
      ) : (
        <div className="flex rounded-lg overflow-hidden shadow-lg bg-white w-3/4 h-[600px] p-6">
          <div className="flex items-center justify-center w-1/2 bg-white">
            <Image
              src="/login.svg"
              alt="Company Logo"
              layout="responsive"
              width={200}
              height={200}
              className="object-contain p-4"
            />
          </div>
          <div className="flex items-center justify-center w-1/2 p-6">
            <form className="flex flex-col w-full" onSubmit={handleSubmit}>
              <h2 className="text-2xl font-semibold mb-6 text-center">
                Register
              </h2>
              {error && (
                <div className="mb-4 text-red-500 text-center">{error}</div>
              )}
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700">
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700">
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Knowledge Area:
                </label>
                <select
                  value={knowledgeArea}
                  onChange={(e) => setKnowledgeArea(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="" disabled>
                    Select Knowledge Area
                  </option>
                  {knowledgeAreas.map((area) => (
                    <option key={area._id} value={area.name}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="m-3">
                <label className="block text-gray-700 font-bold mb-2">
                  Category:
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat._id || cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
              >
                Register
              </button>
              <div className="mt-4 text-center">
                <p>
                  Already have an account?{" "}
                  <Link
                    href="/auth/Login"
                    className="text-blue-500 hover:underline"
                  >
                    Login here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignUp;
