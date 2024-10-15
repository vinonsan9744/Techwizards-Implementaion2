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
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Initialize the  model
        LocationModel = await createLocationModel(sequelize);
        LocomotivePilotModel = await createLocomotivePilotModel(sequelize);
        AdminModel = await createAdminModel(sequelize);
        HazardModel = await createHazardModel(sequelize);
        LocomotivePilotHazardModel = await createLocomotivePilotHazardModel (sequelize);


        await sequelize.sync();
        console.log('Database synced successfully.');

        await sequelize.sync();
        console.log('Database synced successfully.');
    }
    catch (error) {
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

