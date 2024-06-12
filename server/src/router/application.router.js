import express from "express";
import {
  checkExistingApplication,
  myTicket,
  postApplication,
  checkRegistration,
  applicantEventDelete,
  getEventApplications,
} from "../controllers/application.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/post", authMiddleware, postApplication);
router.get("/applicant", authMiddleware, myTicket);
router.post("/check", authMiddleware, checkExistingApplication);
router.get("/check-registration/:eventId", authMiddleware, checkRegistration);
router.delete("/:id", authMiddleware, applicantEventDelete);
router.get("/:eventId", authMiddleware, getEventApplications);

export default router;