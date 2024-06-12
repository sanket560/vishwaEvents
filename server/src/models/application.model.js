import mongoose from "mongoose";
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  collegeName: {
    type: String,
    required: true
  },
  collegeEmail: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  }
});

const Application = mongoose.model("Application", applicationSchema);
export default Application;