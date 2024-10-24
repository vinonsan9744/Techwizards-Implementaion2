import express from "express";
import { addHazard } from "../controller/LocomotivePilotHazardController.js"; // Create a new hazard controller

const router = express.Router();


// Add hazard route
router.post("/addHazard", addHazard);

export default router;
