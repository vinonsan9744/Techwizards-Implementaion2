import { DataTypes, Op } from 'sequelize';

const generateLocationId = async (locationType, Location) => {
    const prefix = locationType.slice(0, 3).toUpperCase(); 

    // Fetch the latest locationId with the same prefix (for systematic generation)
    const lastLocation = await Location.findOne({
        where: {
            locationId: { [Op.like]: `${prefix}%` } // Find IDs that start with the prefix
        },
        order: [['createdAt', 'DESC']] // Sort by creation date to get the latest
    });

    let suffix = '001'; // Default suffix if no matching record is found
    if (lastLocation) {
        const lastId = lastLocation.locationId;
        const lastSuffix = parseInt(lastId.slice(3)); // Extract the numeric part of the last ID
        suffix = (lastSuffix + 1).toString().padStart(3, '0'); // Increment and pad with zeros
    }

    return `${prefix}${suffix}`;
};

export const createLocationModel = (sequelize) => {
    const Location = sequelize.define('Location', {
        locationId: {
            type: DataTypes.STRING(6),
            primaryKey: true,
        },
        locationType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        locationName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        locationContactNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [9, 9]
            }
        }, 
    });

    // Pre-save hook to automatically generate the locationId based on locationType
    Location.beforeCreate(async (location) => {
        location.locationId = await generateLocationId(location.locationType, Location);
    });

    return Location;
};
