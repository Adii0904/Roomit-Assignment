import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // making the database connection here;

    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`my database is connected ${connection.connection.host}`);
  } catch (err) {
    console.log("error in mongodb connection string", err.message);
    process.exit(1);
  }
};

export default connectDB;
