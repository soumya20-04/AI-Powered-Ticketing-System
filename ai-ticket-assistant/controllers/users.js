import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { inngest } from "../inngest/client.js";

// Signup Controller 
export const signup = async (req, res) => {
  const { email, password, skills = [] } = req.body;

  try {
    // Hash the password
    const hashed = await bcrypt.hash(password, 10);

    // Create user with hashed password
    const user = await User.create({ email, password: hashed, skills });

    // Fire Inngest signup event
    await inngest.send({
      name: "user/signup",
      data: { email },
    });

    // Generate JWT token
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Return user and token
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: "Signup failed", details: error.message });
  }
};

// Login Controller 
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ error: "User not found" });

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
};

// Logout Controller
export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({ error: "Unauthorized" });

    // Verify token 
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err)
        return res.status(401).json({ error: "Unauthorized" });

      return res.json({ message: "Logout Successfully" });
    });
  } catch (error) {
    res.status(500).json({ error: "Logout failed", details: error.message });
  }
};


  
