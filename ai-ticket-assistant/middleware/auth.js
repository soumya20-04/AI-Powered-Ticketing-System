import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token found." });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET not defined in .env");
    return res.status(500).json({ message: "Server misconfiguration" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified. Payload:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please login again." });
    }
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
