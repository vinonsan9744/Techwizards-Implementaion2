import express from "express";
import {
    getAllLocomotivePilots,
    addLocomotivePilot,
    getLocomotivePilotById,
    updateLocomotivePilot,
    locomotivePilotLogin
}
    from "../controller/LocomotivePilotController.js";

const router = express.Router();
router.get("/getAll", getAllLocomotivePilots);
router.post("/addlocomotivePilot", addLocomotivePilot);
router.get('/getByLPid/:id', getLocomotivePilotById);
router.patch('/:id', updateLocomotivePilot);
router.post('/login', locomotivePilotLogin);

export default router;
