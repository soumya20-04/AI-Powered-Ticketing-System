import jwt from "jsonwebtoken";

// Middleware to authenticate incoming requests using JWT
export const authenticate = (req, res, next) => {

  // Extract token from Authorization header
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token found." });
  }

  // Ensure JWT_SECRET is set in environment variables
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET not defined in .env");
    return res.status(500).json({ message: "Server misconfiguration" });
  }

  try {
    // Verify the token using the secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Log decoded token payload for debugging
    console.log("Token verified. Payload:", decoded);

    // Attach user info to request object
    req.user = decoded;

    // Continue to next middleware/route handler
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);

    // If token is expired
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please login again." });
    }

    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
