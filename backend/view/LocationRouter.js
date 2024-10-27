import express from "express";
import { getAllLocations,addLocation,getFirstAndLastLocation,getLocationById ,getTasksByLocationName} from "../controller/LocationController.js";

const router = express.Router();
router.get("/getAll", getAllLocations);
router.post("/addLocation", addLocation);
router.get('/firstlast/:locationType', getFirstAndLastLocation);
router.get('/get/:locationId', getLocationById);
router.get('/locationName/:locationName', getTasksByLocationName);


export default router;