import express from "express";
import { updateProfileValidation } from "../validators/profile.validator.js";
import profileController from "../controllers/profile.controller.js";

const router = express.Router();

// Get profile page
router.get("/", profileController.getDefault);

// Update profile
router.post("/", updateProfileValidation, profileController.postUpdate);

// Upgrade to premium
router.get("/upgrade", profileController.getUpgrade);

export default router;
