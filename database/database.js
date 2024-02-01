import dbConfig from "../config/dbConfig.json" assert { type: "json" };
import mongoose from "mongoose";

async function connectMongoDB() {
  try {
    await mongoose.connect(dbConfig.database.url, {
      dbName: dbConfig.database.name,
    });
    console.log(`Database connected Successfully`);
  } catch (error) {
    console.log("Error while connecting database", error.message);
    throw error;
  }
}

export default connectMongoDB;
