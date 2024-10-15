import { LocomotivePilotHazardModel } from "../postgres/postgres.js";

export const addHazard = async (req, res) => {
  const { locomotivePilotID, locationName, HazardType, description } = req.body;

  try {
    const newHazard = await LocomotivePilotHazardModel.create({
      locomotivePilotID,
      locationName,
      HazardType,
      description
    });
    
    return res.status(201).json({ message: "Hazard added successfully", newHazard });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ "error": "Internal server error" });
  }
};
