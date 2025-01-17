import { LocationModel } from "../postgres/postgres.js"; // Assuming you've exported LocationModel from postgresql.js
import { Op } from "sequelize";

// Get all locations
export const getAllLocations = async (req, res) => {
  try {
    const locations = await LocationModel.findAll();
    if (locations.length == 0) {
      return res.status(404).json({ message: "No locations found" });
    }
    return res.status(200).json(locations);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

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
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
// Get the first and last posted data for a specific locationType
export const getFirstAndLastLocation = async (req, res) => {
  const { locationType } = req.params;

  try {
    // Find the first posted location for the given locationType
    const firstLocation = await LocationModel.findOne({
      where: { locationType },
      order: [["createdAt", "ASC"]], // Sort ascending by creation date to get the first
    });

    // Find the last posted location for the given locationType
    const lastLocation = await LocationModel.findOne({
      where: { locationType },
      order: [["createdAt", "DESC"]], // Sort descending by creation date to get the last
    });

    if (!firstLocation || !lastLocation) {
      return res
        .status(404)
        .json({ message: "No locations found for the specified locationType" });
    }

    return res.status(200).json({
      firstLocation,
      lastLocation,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
// Get location by locationId
export const getLocationById = async (req, res) => {
  const { locationId } = req.params;

  try {
    const location = await LocationModel.findOne({ locationId });

    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    res.status(200).json(location);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// Get tasks by locationName
export const getTasksByLocationName = async (req, res) => {
  const { locationName } = req.params;

  try {
    const location = await LocationModel.findOne({ locationName });

    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    res.status(200).json(location);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// Get next location by locationName
export const getNextLocation = async (req, res) => {
  const { locationName } = req.params;

  console.log("Received locationName:", locationName);

  try {
    // Find the current location with the provided locationName (case-insensitive search)
    const currentLocation = await LocationModel.findOne({
      where: {
        locationName: {
          [Op.iLike]: locationName, // Case-insensitive match (PostgreSQL specific)
        },
      },
    });

    // Check if the current location exists
    if (!currentLocation) {
      return res.status(404).json({ error: "Current location not found" });
    }

    console.log("Current location found:", currentLocation);

    // Try to find the next location by locationId in ascending order
    let nextLocation = await LocationModel.findOne({
      where: {
        locationId: { [Op.gt]: currentLocation.locationId }, // Find next by ascending locationId
      },
      order: [["locationId", "ASC"]], // Ensure ascending order by locationId
    });

    // If no next location is found, try to find the previous location in descending order
    if (!nextLocation) {
      console.log(
        "No next location found in ascending order, switching to descending order."
      );

      nextLocation = await LocationModel.findOne({
        where: {
          locationId: { [Op.lt]: currentLocation.locationId }, // Find previous by descending locationId
        },
        order: [["locationId", "DESC"]], // Ensure descending order by locationId
      });
    }

    // If no location is still found, return a message
    if (!nextLocation) {
      return res
        .status(404)
        .json({ message: "No next or previous location found" });
    }

    // Send the next or previous location as a response
    return res.status(200).json(nextLocation);
  } catch (error) {
    console.error("Error fetching next location:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
