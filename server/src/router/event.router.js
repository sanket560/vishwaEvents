import express from "express";
import {deleteMyEvent, getEvent , getMyEvent, postEvent, updateMyEvent} from "../controllers/event.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../config/multerConfig.js";
const router = express.Router();
router.get("/events", getEvent);
router.post("/postevent", authMiddleware, upload.fields([{ name: 'posterFile' }, { name: 'bannerFile' }]), postEvent);
router.get("/myevent",authMiddleware,getMyEvent)
router.put("/update/:id",authMiddleware,updateMyEvent)
router.delete("/delete/:id",authMiddleware,deleteMyEvent)
export default router;
