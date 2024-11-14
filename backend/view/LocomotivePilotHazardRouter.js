import express from "express";
import { addHazard,getRecordHazards,countHazards,getAllHazards,getHazardById } from "../controller/LocomotivePilotHazardController.js"; // Create a new hazard controller

const router = express.Router();


// Add hazard route
router.post("/addHazard", addHazard);
router.get("/getRecordHazards", getRecordHazards);
router.get("/countHazards", countHazards);
router.get("/getHazard", getAllHazards);
router.get("/getHazardById/:HazardID", getHazardById);

export default router;
