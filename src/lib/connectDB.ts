import mongoose from "mongoose";
export const connectToDatabase = async () => {
  try {
    if (mongoose.connections && mongoose.connections[0].readyState) {
      console.log("Already connected to the database.");
      return;
    }
    const { connection } = await mongoose.connect(
      process.env.MONGODB_URI as string,
      {
        dbName: "HushMailUserCredentials",
      }
    );
    console.log(`Connected to database: ${connection.host}`);
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw new Error("Error connecting to database");
  }
};
