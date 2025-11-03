// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";

// dotenv.config();

// export const verifyToken = (request, response, next) => {
//     const token = request.headers.authorization?.split(" ")[1];

//     if (!token) {
//         return response.status(400).json({ message: "Access Denied. There is No token provided." });
//     }
//     try{
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         request.user = decoded;
//         next();
//     } catch(err){
//         response.status(400).json({message:"Invalid Token"});
//     }
// };


import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  console.log("========== VERIFY TOKEN DEBUG ==========");

  // Log all request headers
  console.log("Request Headers:", req.headers);

  // Check Authorization header
  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader);

  if (!authHeader) {
    console.log("❌ No Authorization header found!");
    return res.status(403).json({ message: "Access Denied. There is No token provided." });
  }

  // Extract token (after "Bearer ")
  const token = authHeader.split(" ")[1];
  console.log("Extracted Token:", token);

  if (!token) {
    console.log("❌ Token not found after Bearer keyword!");
    return res.status(403).json({ message: "Access Denied. Token missing." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token Verified Successfully! Decoded Data:", decoded);

    req.user = decoded;
    next();
  } catch (error) {
    console.log("❌ Token Verification Failed:", error.message);
    return res.status(401).json({ message: "Invalid Token" });
  }

  console.log("========================================");
};


// Role verification
export const checkAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};


