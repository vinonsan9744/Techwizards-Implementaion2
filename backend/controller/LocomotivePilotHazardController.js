import { LocomotivePilotHazardModel, LocomotivePilotModel } from "../postgres/postgres.js";

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

export const getAllHazards = async (req, res) => {
  try {
      const hazards = await LocomotivePilotHazardModel.findAll({
          include: [
              {
                  model: LocomotivePilotModel,
                  attributes: ['locomotiveName', 'locomotivePhoneNo'] // Only include specific fields
              }
          ]
      });

      return res.status(200).json({ success: true, hazards });
  } catch (error) {
      console.error('Error fetching hazards:', error.message || error);
      return res.status(500).json({ error: 'Failed to retrieve hazards', details: error.message });
  }
};