import { DataTypes } from 'sequelize';

// Function to generate a unique locomotivePilotID
const generateLocomotivePilotId = async (LocomotivePilot) => {
    const count = await LocomotivePilot.count();
    return `LID${String(count + 1).padStart(3, '0')}`; // Generates IDs like LID001, LID002, etc.
};

export const createLocomotivePilotModel = (sequelize) => {
    const LocomotivePilot = sequelize.define('LocomotivePilot', {
        locomotivePilotID: {
            type: DataTypes.STRING(6),
            primaryKey: true,
        },
        locomotiveName: {
            type: DataTypes.STRING,
            allowNull: false
        },  
        locomotiveEmail: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            }
        },
        locomotivePhoneNo: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [9, 15], // Adjust based on your phone number requirements
            }
        },
        password: {
            type: DataTypes.STRING,
            validate: {
                len: [8, 8] // Password length validation
            }
        },
    });

    // Pre-save hook to automatically generate locomotivePilotID and password
    LocomotivePilot.beforeCreate(async (pilot) => {
        pilot.locomotivePilotID = await generateLocomotivePilotId(LocomotivePilot);
        pilot.password = generateRandomPassword(); // Call the function to generate a random password
    });

    return LocomotivePilot;
};

// Function to generate a random 8-character password
const generateRandomPassword = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
};
