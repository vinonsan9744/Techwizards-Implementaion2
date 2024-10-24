import { LocomotivePilotModel } from "../postgres/postgres.js"; 
import nodemailer from 'nodemailer'; // Import nodemailer
import dotenv from 'dotenv';

// Load environment variables (static config for your app)
dotenv.config();

// Function to create a Nodemailer transporter for a specific user
const createTransporter = (email, password) => {
    return nodemailer.createTransport({
        service: 'gmail', // or another email provider
        auth: {
            user: email, // User's email address
            pass: password, // User's email password
        },
    });
};

const sendWelcomeEmail = async (locomotiveName, locomotiveEmail, password) => {
    // Create a transporter with the user's email and password
    const transporter = nodemailer.createTransport({
        service: 'gmail', // or another email provider
        auth: {
            user: locomotiveEmail, // Use user's email
            pass: password,         // Use user's password
        },
    });

    const mailOptions = {
        from: locomotiveEmail, // Sender email
        to: locomotiveEmail,    // Send to the user's email
        subject: 'Welcome to Railway Safety System - Your Credentials',
        text: `Dear ${locomotiveName},\n\nYour account has been created successfully!\nHere are your login credentials:\n\nEmail: ${locomotiveEmail}\nPassword: ${password}\n\nPlease change your password after logging in for security reasons.\n\nBest regards,\nRailway Safety System Team`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${locomotiveEmail}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email'); // Propagate the error
    }
};

// Get all locomotive pilots
export const getAllLocomotivePilots = async (req, res) => {
    try {
        const pilots = await LocomotivePilotModel.findAll();
        if (pilots.length === 0) {
            return res.status(404).json({ message: "No locomotive pilots found" });
        }
        return res.status(200).json(pilots);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const addLocomotivePilot = async (req, res) => {
    const { locomotiveName, locomotiveEmail, locomotivePhoneNo, password } = req.body;

    try {
        const existingPilot = await LocomotivePilotModel.findOne({ where: { locomotiveEmail } });
        if (!existingPilot) {
            // Create the new locomotive pilot
            const newPilot = await LocomotivePilotModel.create({
                locomotiveName,
                locomotiveEmail,
                locomotivePhoneNo,
                password,
            });

            // Send the email using the user's credentials
            await sendWelcomeEmail(locomotiveName, locomotiveEmail, password);

            return res.status(201).json({ message: "Locomotive pilot added successfully", newPilot });
        }

        return res.status(409).json({ message: "Locomotive pilot already exists" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Get locomotive pilot by ID
export const getLocomotivePilotById = async (req, res) => {
    const { id } = req.params;

    try {
        const pilot = await LocomotivePilotModel.findOne({ where: { locomotivePilotID: id } });
        if (!pilot) {
            return res.status(404).json({ message: "Locomotive pilot not found" });
        }
        return res.status(200).json(pilot);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Update a locomotive pilot by ID
export const updateLocomotivePilot = async (req, res) => {
    const { id } = req.params;
    const { locomotiveName, locomotiveEmail, locomotivePhoneNo } = req.body;

    try {
        // Find the locomotive pilot by ID
        const pilot = await LocomotivePilotModel.findOne({ where: { locomotivePilotID: id } });

        if (!pilot) {
            return res.status(404).json({ message: "Locomotive pilot not found" });
        }

        // Update the locomotive pilot's details
        await LocomotivePilotModel.update(
            { locomotiveName, locomotiveEmail, locomotivePhoneNo }, 
            { where: { locomotivePilotID: id } }
        );

        return res.status(200).json({ message: "Locomotive pilot updated successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// POST - Login with locomotivePilotID and Password
export const locomotivePilotLogin = async (req, res) => {
    const { locomotivePilotID, password } = req.body;
  
    try {
      // Find the locomotive pilot by ID
      const pilot = await LocomotivePilotModel.findOne({ where: { locomotivePilotID } });
  
      // Check if locomotivePilotID exists
      if (!pilot) {
        return res.status(404).json({ error: "Locomotive Pilot ID not found" });
      }
  
      // Check if the Password is correct
      if (pilot.password !== password) {
        return res.status(401).json({ error: "Incorrect password" });
      }
  
      // If both locomotivePilotID and Password are correct, login success
      return res.status(200).json({ message: "Login successful", pilot });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
};
