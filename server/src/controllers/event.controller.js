import Event from "../models/event.model.js";

export const getEvent = async (req, res, next) => {
  try {
    const eventData = await Event.find();
    res.status(200).json({
      success: true,
      eventData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: error.message,
    });
  }
};

export const postEvent = async (req, res, next) => {
  try {
    const {
      heading,
      description,
      event_date,
      event_time,
      registration_end,
      venue,
    } = req.body;
    const postedBy = req.user._id;

    // Get the URLs of the uploaded files
    const posterUrl = req.files.posterFile[0].path;
    const bannerUrl = req.files.bannerFile[0].path;

    // Create the event
    const event = await Event.create({
      heading,
      description,
      poster: posterUrl,
      banner: bannerUrl,
      event_date,
      event_time,
      registration_end,
      venue,
      postedBy,
    });

    res.status(200).json({ success: true, message: "Event Posted Successfully", event });
  } catch (error) {
    console.error("Error creating event:", error);
    next(error);
  }
};

export const getMyEvent = async (req, res, next) => {
  const myEvent = await Event.find({ postedBy: req.user._id });
  res.status(200).json({
    success: true,
    myEvent,
  });
};

export const updateMyEvent = async (req, res, next) => {
  const { id } = req.params;
  let event = await Event.findById(id);
  event = await Event.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    event,
    message: "Event updated successfuly",
  });
};

export const deleteMyEvent = async (req, res, next) => {
  const { id } = req.params;
  let event = await Event.findById(id);
  await event.deleteOne();
  res.status(200).json({
    success: true,
    message: "Event Deleted",
  });
};
