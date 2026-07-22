import express from "express";
import { getSettingsController, updateSettingsController } from "../controllers/SettingsController.js";
const router = express.Router();
router.get("/", getSettingsController);
router.put("/", updateSettingsController);
export default router;
