import express from "express";
import { addHazard,getAllHazards } from "../controller/LocomotivePilotHazardController.js"; // Create a new hazard controller

const router = express.Router();


// Add hazard route
router.post("/addHazard", addHazard);
router.get("/getHazard", getAllHazards);

export default router;
