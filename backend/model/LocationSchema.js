import { DataTypes, Op } from 'sequelize';

const generateLocationId = async (locationType, Location) => {
    const prefix = locationType.slice(0, 3).toUpperCase(); // Take first 3 characters of locationType

    // Fetch the latest locationId with the same prefix (for systematic generation)
    const lastLocation = await Location.findOne({
        where: {
            locationId: { [Op.like]: `${prefix}%` } // Find IDs starting with prefix
        },
        order: [['createdAt', 'DESC']] // Sort by creation date to get the latest
    });

    let suffix = '001'; // Default suffix if no matching record is found
    if (lastLocation) {
        const lastId = lastLocation.locationId;
        const lastSuffix = parseInt(lastId.slice(3)); // Extract the numeric part
        suffix = (lastSuffix + 1).toString().padStart(3, '0'); // Increment and pad with zeros
    }

    return `${prefix}${suffix}`;
};

export const createLocationModel = (sequelize) => {
    const Location = sequelize.define('Location', {
        locationId: {
            type: DataTypes.STRING(10),  // Length to fit the ID structure (prefix + numeric part)
            primaryKey: true,  // Set as the primary key
            unique: true,      // Ensure it is unique
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
                len: [9, 12]
            }
        },
    });

    // Pre-save hook to automatically generate locationId based on locationType
    Location.beforeCreate(async (location) => {
        location.locationId = await generateLocationId(location.locationType, Location);
    });

    return Location;
};
