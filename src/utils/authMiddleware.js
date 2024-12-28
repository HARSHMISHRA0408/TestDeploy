// import jwt from 'jsonwebtoken';

// export const verifyToken = (req, res, next) => {
//   const token = req.headers['authorization']?.split(' ')[1]; // Expecting token to be in the format "Bearer <token>"
  
//   if (!token) {
//     return res.status(401).json({ success: false, message: "No token provided" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // Attach decoded user info to the request object
//     next();
//   } catch (error) {
//     return res.status(403).json({ success: false, message: "Invalid or expired token" });
//   }
// }; 

import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log("Authorization Header:", authHeader); // Debug header value

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided or invalid format" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT payload:", decoded); // Log decoded token for debugging
    req.user = decoded; // Attach decoded user info to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("JWT verification error:", error.message); // Log error details
    return res.status(403).json({ success: false, message: "Invalid or expired token" });
  }
};
