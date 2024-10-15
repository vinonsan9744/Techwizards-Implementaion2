import { LocationModel } from "../postgres/postgres.js";  // Assuming you've exported LocationModel from postgresql.js

// Get all locations
export const getAllLocations = async (req, res) => {
    try {
        const locations = await LocationModel.findAll();
        if (locations.length == 0) {
            return res.status(404).json({ message: "No locations found" });
        }
        return res.status(200).json(locations);
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({ "error": "Internal server error" });
    }
}

// Add a new location
export const addLocation = async (req, res) => {
    const { locationType, locationName, locationContactNumber } = req.body;

    try {
        // Check if location already exists by locationName or a unique field
        const location = await LocationModel.findOne({ where: { locationName } });

        if (location == null) {
            // If location does not exist, create a new one
            await LocationModel.create(req.body);
            return res.status(201).json({ message: "Location added successfully" });
        }
        return res.status(409).json({ message: "Location already exists" });
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({ "error": "Internal server error" });
    }
}
// Get the first and last posted data for a specific locationType
export const getFirstAndLastLocation = async (req, res) => {
    const { locationType } = req.params;

    try {
        // Find the first posted location for the given locationType
        const firstLocation = await LocationModel.findOne({
            where: { locationType },
            order: [['createdAt', 'ASC']],  // Sort ascending by creation date to get the first
        });

        // Find the last posted location for the given locationType
        const lastLocation = await LocationModel.findOne({
            where: { locationType },
            order: [['createdAt', 'DESC']],  // Sort descending by creation date to get the last
        });

        if (!firstLocation || !lastLocation) {
            return res.status(404).json({ message: "No locations found for the specified locationType" });
        }

        return res.status(200).json({
            firstLocation,
            lastLocation
        });
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({ "error": "Internal server error" });
    }
};