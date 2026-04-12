const mongoose = require("mongoose");

module.exports = async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("❌ MONGO_URI missing");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
    console.log("Host:", mongoose.connection.host);
  } catch (err) {
    console.error("❌ MongoDB connection failed:");
    console.error(err.message);

    // 🔥 DO NOT CRASH HARD (Render hates that)
    throw err;
  }
};