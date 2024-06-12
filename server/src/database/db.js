import mongoose from "mongoose";
const URI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(URI);
    console.log( `connection successfull to db ${connectionInstance.connection.host} `);
  } catch (error) {
    console.log(error);
    process.exit(0);
  }
}

export default connectDB;

