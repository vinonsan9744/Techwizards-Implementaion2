import { Sequelize } from "sequelize";
import { createLocationModel } from "../model/LocationSchema.js";
import { createLocomotivePilotModel } from "../model/LocomotivePilotSchema.js";
import { createAdminModel } from "../model/AdminSchema.js";
import { createHazardModel } from "../model/HazardSchema.js";
import { createLocomotivePilotHazardModel } from "../model/LocomotivePilotHazardSchema.js";

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

// Establish the connection and initialize models
const connection = async () => {
    try {
        // Authenticate the database connection
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Initialize the models
        LocationModel = await createLocationModel(sequelize);
        LocomotivePilotModel = await createLocomotivePilotModel(sequelize);
        AdminModel = await createAdminModel(sequelize);
        HazardModel = await createHazardModel(sequelize);
        LocomotivePilotHazardModel = await createLocomotivePilotHazardModel(sequelize);

        // Define associations after models are initialized
        LocomotivePilotModel.hasMany(LocomotivePilotHazardModel, { foreignKey: 'locomotivePilotID' });
        LocomotivePilotHazardModel.belongsTo(LocomotivePilotModel, { foreignKey: 'locomotivePilotID' });

        // Add the association to LocationModel using locationName as the key
        LocationModel.hasMany(LocomotivePilotHazardModel, { foreignKey: 'locationName', sourceKey: 'locationName' });
        LocomotivePilotHazardModel.belongsTo(LocationModel, { foreignKey: 'locationName', targetKey: 'locationName' });


        // Sync all models with the database
        await sequelize.sync({ force: false }); // Use `{ force: true }` if you need to drop and recreate tables
        console.log('Database synced successfully.');

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

// Export initialized models and connection function
export {
    connection,
    LocationModel,
    LocomotivePilotModel,
    AdminModel,
    HazardModel,
    LocomotivePilotHazardModel
};
