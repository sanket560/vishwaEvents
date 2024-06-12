import express from "express";
import { home, register, login, user } from "../controllers/auth.controller.js";
import { signupSchema, loginSchema } from "../validators/auth.validator.js";
import validate from "../middleware/validate.middleware.js";
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router();

router.route("/").get(home);
router.route("/register").post(validate(signupSchema), register);
router.route("/login").post(validate(loginSchema), login);
router.route("/user").get(authMiddleware , user);

export default router;
