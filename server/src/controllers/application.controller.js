import Application from "../models/application.model.js";

export const postApplication = async (req, res) => {
  try {
    const {
      eventId,
      userId,
      name,
      phone,
      email,
      collegeEmail,
      collegeName,
      department,
    } = req.body;

    // Check if required fields are missing
    if (
      !eventId ||
      !userId ||
      !name ||
      !phone ||
      !email ||
      !collegeEmail ||
      !collegeName ||
      !department
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create a new application
    const application = new Application({
      eventId,
      userId,
      name,
      phone,
      email,
      collegeEmail,
      collegeName,
      department,
    });

    // Save the application
    await application.save();

    return res.status(201).json(application);
  } catch (error) {
    console.error("Error creating application:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const myTicket = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const applications = await Application.find({ userId });
    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const applicantEventDelete = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedApplication = await Application.findByIdAndDelete(id);
    if (!deletedApplication) {
      return res.status(404).json({ error: 'Application not found' });
    }
    return res.status(200).json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    console.error("Error deleting application:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const checkExistingApplication = async (req, res, next) => {
  try {
    const { eventId, userId } = req.body;

    const existingApplication = await Application.findOne({ eventId, userId });

    res.json({ exists: !!existingApplication });
  } catch (error) {
    console.error("Error checking existing application:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const checkRegistration = async (req, res, next) => {
  try {
    const { _id: userId } = req.user; 
    const { eventId } = req.params;

    const application = await Application.findOne({ eventId, userId });

    if (application) {
      res.json({ registered: true });
    } else {
      res.json({ registered: false });
    }
  } catch (error) {
    console.error("Error checking registration:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getEventApplications = async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    const applications = await Application.find({ eventId });
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
