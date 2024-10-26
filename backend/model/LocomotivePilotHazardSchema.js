import { DataTypes } from "sequelize";

export const createLocomotivePilotHazardModel = (sequelize) => {
  const LocomotivePilotHazard = sequelize.define('LocomotivePilotHazard', {
    HazardID: {
      type: DataTypes.STRING(6), // Ensure it's a string with 6 characters (e.g., ELE001, BUL001)
      primaryKey: true // Set as primary key
    },
    locomotivePilotID: {
      type: DataTypes.STRING(6), // Assuming it's a string, adjust type if needed
      allowNull: false,
    },
    locationName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    HazardType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT, // Can hold larger descriptions
    }
  }, {
    hooks: {
      // Sequelize hook to automatically generate HazardID before creating the entry
      beforeCreate: async (hazard) => {
        // Capitalize the first three letters of HazardType
        const hazardPrefix = hazard.HazardType.substring(0, 3).toUpperCase();

        // Fetch all hazards with the same HazardType
        const hazards = await LocomotivePilotHazard.findAll({
          where: { HazardType: hazard.HazardType },
          order: [['HazardID', 'DESC']]
        });

        // If there’s no existing record with that type, start from 001
        let newIdNumber = "001";
        if (hazards.length > 0) {
          const lastHazard = hazards[0].HazardID;
          const lastIdNumber = parseInt(lastHazard.slice(3), 10);
          newIdNumber = String(lastIdNumber + 1).padStart(3, '0');
        }

        // Generate the new HazardID
        hazard.HazardID = `${hazardPrefix}${newIdNumber}`;
      }
    }
  });

   // Association with LocomotivePilot model
   LocomotivePilotHazard.belongsTo(LocomotivePilot, {
    foreignKey: 'locomotivePilotID',
    targetKey: 'locomotivePilotID'
});
  

  return LocomotivePilotHazard;
};

