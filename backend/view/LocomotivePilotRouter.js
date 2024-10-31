import express from "express";
import {
    getAllLocomotivePilots,
    addLocomotivePilot,
    getLocomotivePilotById,
    updateLocomotivePilot,
    locomotivePilotLogin,
    verifyUsername,
    verifyEmail,
    sendOTP, 
    verifyOtp,
    resetPassword,
    updatePasswordById
}
    from "../controller/LocomotivePilotController.js";

const router = express.Router();
router.get("/getAll", getAllLocomotivePilots);
router.post("/addlocomotivePilot", addLocomotivePilot);
router.get('/getByLPid/:id', getLocomotivePilotById);
router.patch('/:id', updateLocomotivePilot);
router.post('/login', locomotivePilotLogin);
router.post('/verifyUsername', verifyUsername);
router.post('/verifyEmail', verifyEmail);
router.post('/sendOTP', sendOTP); 
router.post('/verifyOTP', verifyOtp);
router.post('/reset-password', resetPassword);
router.patch('/updatePassword/:id', updatePasswordById);


export default router;
