import { LocomotivePilotHazardModel } from "../postgres/postgres.js";
// Add a new hazard
export const addHazard = async (req, res) => {
  const { locomotivePilotID, locationName, HazardType, Date, description } = req.body;

  try {
      const newHazard = await LocomotivePilotHazardModel.create({
          locomotivePilotID,
          locationName,
          HazardType,
          Date,
          description
      });
      return res.status(201).json({ success: true, message: "Hazard added successfully", newHazard });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message || "Internal server error" });
  }
};


// Get all hazards
export const getAllHazards = async (req, res) => {
    try {
      const hazards = await locomotivePilotHazardModel.findAll(); // Fetch all hazards
      return res.status(200).json({ success: true, hazards }); // Return all hazards
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message || "Internal server error" });
    }
  };
  
  