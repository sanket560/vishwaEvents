import User from "../models/user.model.js";

// home
const home = async ( req , res) => {
  try {
    res.send("Hello World");
  } catch (error) {
    console.log("error", error);
  }
}

// register
const register = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      collegeEmail,
      email,
      collegeName,
      department,
      password,
    } = req.body;

    // Check if the email already exists
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create a new user
    const newUser = await User.create({
      name,
      phone,
      collegeEmail,
      email,
      collegeName,
      department,
      password,
    });

    // Generate a token for the new user
    const token = await newUser.generateToken();

    // Send response with token and user ID
    res.json({
      message: "Registration successful",
      token,
      userId: newUser._id.toString(),
    });
  } catch (error) {
    // Handle errors
    console.error("Error in registration:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// login
const login = async (req, res, next) => { 
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email: email });

    if (!userExist) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await userExist.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      token: await userExist.generateToken(),
      userId: userExist._id.toString(),
    });
  } catch (error) {
    next(error); 
  }
}

// user logic to send user data
const user = async (req, res) =>{
  try {
    const userData = req.user;
    return res.status(200).json({message : userData})
  } catch (error) {
    console.log("error from user route");
  }
}

export {home , register , login , user};