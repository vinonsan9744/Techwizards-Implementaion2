import { Sequelize } from "sequelize";
import { createLocationModel } from "../model/LocationSchema.js";
import { createLocomotivePilotModel } from "../model/LocomotivePilotSchema.js";
import {createAdminModel} from "../model/AdminSchema.js";
import { createHazardModel } from "../model/HazardSchema.js";
import {createLocomotivePilotHazardModel} from "../model/LocomotivePilotHazardSchema.js"

// Setup the connection to PostgreSQL database
const sequelize = new Sequelize('TechWizard', 'postgres', 'root', {
    host: 'localhost',
    dialect: 'postgres'
});

let LocationModel = null;
let LocomotivePilotModel = null;
let AdminModel = null;
let HazardModel = null;
let LocomotivePilotHazardModel = null;

// Establish the connection and sync the model
const connection = async () => {
    try {
        // Authenticate the database connection
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Initialize the models
        LocationModel = await createLocationModel(sequelize);
        console.log('LocationModel initialized.');
        
        LocomotivePilotModel = await createLocomotivePilotModel(sequelize);
        console.log('LocomotivePilotModel initialized.');

        AdminModel = await createAdminModel(sequelize);
        console.log('AdminModel initialized.');

        HazardModel = await createHazardModel(sequelize);
        console.log('HazardModel initialized.');

        LocomotivePilotHazardModel = await createLocomotivePilotHazardModel(sequelize);
        console.log('LocomotivePilotHazardModel initialized.');

        // Sync all models with the database
        await sequelize.sync({ force: false }); // You can change to `{ force: true }` if you want to drop and recreate tables
        console.log('Database synced successfully.');
        
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

export {
    connection,
    LocationModel,
    LocomotivePilotModel,
    AdminModel,
    HazardModel,
    LocomotivePilotHazardModel
}

