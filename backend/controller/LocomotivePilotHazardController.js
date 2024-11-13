import { LocomotivePilotHazardModel, LocomotivePilotModel,LocationModel } from "../postgres/postgres.js";

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
export const getRecordHazards = async (req, res) => {
    try {
      const hazards = await LocomotivePilotHazardModel.findAll(); // Fetch all hazards
      return res.status(200).json({ success: true, hazards }); // Return all hazards
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message || "Internal server error" });
    }
  };
  
// Count all hazards
export const countHazards = async (req, res) => {
    try {
        // Use the count() function to get the number of records in LocomotivePilotHazardModel
        const hazardCount = await LocomotivePilotHazardModel.count();
        
        // Return the count as a JSON response
        return res.status(200).json({ success: true, count: hazardCount });
    } catch (error) {
        console.error('Error counting hazards:', error.message || error);
        return res.status(500).json({ error: 'Failed to count hazards', details: error.message });
    }
  };
  

export const getAllHazards = async (req, res) => {
  try {
      const hazards = await LocomotivePilotHazardModel.findAll({
          include: [
              {
                  model: LocomotivePilotModel,
                  attributes: ['locomotiveName', 'locomotivePhoneNo'] // Only include specific fields
              },
              {
                model: LocationModel,
                attributes: ['locationName', 'locationContactNumber'] // Include specific fields from Location
            }
          ]
      });

      for (const hazard of hazards) {
        const location = await LocationModel.findOne({
            where: { locationName: hazard.locationName },
            attributes: ['locationName', 'locationContactNumber']
        });
        hazard.setDataValue('locationDetails', location);
    }

    return res.status(200).json({ success: true, hazards });
  } catch (error) {
      console.error('Error fetching hazards:', error.message || error);
      return res.status(500).json({ error: 'Failed to retrieve hazards', details: error.message });
  }
};


export const getHazardById = async (req, res) => {
    const { HazardID } = req.params; // Get the hazard ID from request parameters
  
    try {
        // Fetch the hazard based on the hazardId
        const hazard = await LocomotivePilotHazardModel.findOne({
            where: { HazardID: HazardID }, // Use the hazardId to find the specific hazard
            include: [
                {
                    model: LocomotivePilotModel,
                    attributes: ['locomotiveName', 'locomotivePhoneNo'] // Only include specific fields
                },
                {
                    model: LocationModel,
                    attributes: ['locationName', 'locationContactNumber'] // Include specific fields from Location
                }
            ]
        });
  
        // Check if the hazard is found
        if (!hazard) {
            return res.status(404).json({ error: 'Hazard not found' });
        }
  
        // Optionally, you can add location details separately if necessary
        const location = await LocationModel.findOne({
            where: { locationName: hazard.locationName },
            attributes: ['locationName', 'locationContactNumber']
        });
        hazard.setDataValue('locationDetails', location);
  
        return res.status(200).json({ success: true, hazard });
    } catch (error) {
        console.error('Error fetching hazard:', error.message || error);
        return res.status(500).json({ error: 'Failed to retrieve hazard', details: error.message });
    }
  };
  