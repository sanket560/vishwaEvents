import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token || !token.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized HTTP, token not provided" });
  }

  const jwtToken = token.replace("Bearer", "").trim();

  try {
    const isVerified = jwt.verify(jwtToken, process.env.JWT_KEY);
    const userData = await User.findOne({ email: isVerified.email }).select({
      password: 0,
      createdAt: 0,
      updatedAt: 0,
    });

    req.user = userData;
    req.token = token;
    req.userID = userData._id;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized HTTP, token verification failed" });
  }
};

export default authMiddleware;
