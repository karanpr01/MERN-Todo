import bcrypt from "bcrypt";
import User  from "../models/user.js";    
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Account already exists. Please login." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = generateToken(user);
    res.cookie("token", token, { httpOnly: true }); 

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error("registerUser error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Missing email or password" });

    const user = await User.findOne({ email }); 
    if (!user) {
      return res.status(401).json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Email or Password is incorrect" });
    }

    const token = generateToken(user);
    res.cookie("token", token, { httpOnly: true });

    return res.status(200).json({ success: true, message: `Welcome ${user.name}`, token: token });
  } catch (err) {
    console.error("loginUser error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
