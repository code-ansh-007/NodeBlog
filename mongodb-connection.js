import mongoose from "mongoose";

async function connectMongoDB(uri) {
  return mongoose.connect(uri);
}

export default connectMongoDB;
