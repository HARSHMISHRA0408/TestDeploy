// // // /api/user/test-status.js
// // //To check test is allowed or not (allow , notallowed , pending or rejected)


// export default async function handler(req, res) {
//   if (req.method === "GET") {
//     // Use verifyToken to authenticate the user and decode the token
//     await verifyToken(req, res, async () => {
//       try {
//         // Access the user information from the decoded token
//         const { test } = req.user;

//         console.log("Decoded test status from token:", test);

//         // Check the test status and respond accordingly
//         switch (test) {
//           case "allowed":
//             return res.status(200).json({ success: true, testStatus: "allowed" });
//           case "notallowed":
//             return res.status(200).json({ success: true, testStatus: "notallowed" });
//           case "pending":
//             return res.status(200).json({ success: true, testStatus: "pending" });
//           case "rejected":
//             return res.status(200).json({ success: true, testStatus: "rejected" });
//           default:
//             return res.status(400).json({ success: false, message: "Invalid test status." });
//         }
//       } catch (error) {
//         console.error("Error verifying test status:", error);
//         res.status(500).json({ success: false, message: "Internal server error." });
//       }
//     });
//   } else {
//     res.status(405).json({ success: false, message: "Method Not Allowed." });
//   }
// }
