import { DataTypes } from "sequelize";

export const createLocomotivePilotHazardModel = (sequelize) => {
  const LocomotivePilotHazard = sequelize.define('LocomotivePilotHazard', {
    HazardID: {
      type: DataTypes.STRING(6), // Ensure it's a string with 6 characters (e.g., ELE001, BUL001)
      allowNull: false,
      primaryKey: true // Set as primary key
    },
    locomotivePilotID: {
      type: DataTypes.STRING(6), // Assuming it's an integer, adjust type if needed
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

        // Query database to get the highest HazardID with the same prefix
        const lastHazard = await LocomotivePilotHazard.findOne({
          where: {
            HazardID: {
              [sequelize.Op.like]: `${hazardPrefix}%`
            }
          },
          order: [['HazardID', 'DESC']] // Order by HazardID descending
        });

        // If there’s no existing record with that prefix, start from 001
        let newIdNumber = "001";
        if (lastHazard && lastHazard.HazardID) {
          const lastIdNumber = parseInt(lastHazard.HazardID.slice(3), 10);
          newIdNumber = String(lastIdNumber + 1).padStart(3, '0');
        }

        // Generate the new HazardID
        hazard.HazardID = `${hazardPrefix}${newIdNumber}`;
      }
    }
  });

  return LocomotivePilotHazard;
};
