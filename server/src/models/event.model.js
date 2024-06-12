import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  poster: {
    type: String,
    required: true
  },
  banner: { 
    type: String,
    required: true
  },
  event_date: {
    type: String,
    required: true
  },
  event_time: {
    type: String,
    required: true
  },
  registration_end: {
    type: String,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
