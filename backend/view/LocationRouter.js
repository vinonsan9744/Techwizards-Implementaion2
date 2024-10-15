import express from "express";
import { getAllLocations,addLocation,getFirstAndLastLocation } from "../controller/LocationController.js";

const router = express.Router();
router.get("/getAll", getAllLocations);
router.post("/addLocation", addLocation);
router.get('/firstlast/:locationType', getFirstAndLastLocation);


export default router;
