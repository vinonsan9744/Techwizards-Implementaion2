import express, { Router } from "express";
import cors from 'cors';
import { connection } from "./postgres/postgres.js";
import locationRouter from "./view/LocationRouter.js"; 
import locomotivePilotRouter from "./view/LocomotivePilotRouter.js";
import  adminRouter from "./view/AdminRouter.js"; 

import hazardRouter from "./view/HazardRouter.js"; 
import locomotivePilotHazardRouter from "./view/LocomotivePilotHazardRouter.js";


const app = express();
app.use(express.json())
app.use(cors())

app.use('/location', locationRouter);
app.use('/locomotivePilot', locomotivePilotRouter);
app.use('/admin', adminRouter);

app.use('/hazard', hazardRouter);
app.use('/pilotHazard',locomotivePilotHazardRouter);



const PORT=8000;
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    
    try {
        await connection(); // Establish database connection
        console.log('Database connected successfully.');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
});