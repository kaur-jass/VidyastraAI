const mongoose = require('mongoose');
require('dotenv').config();

const listCollections = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vidyastra');
    console.log("Connected to MongoDB");
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log("COLLECTIONS AND DOCUMENT COUNTS:");
    for (let col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`- ${col.name}: ${count} docs`);
    }
    await mongoose.connection.close();
  } catch (err) {
    console.error("Error listing collections:", err);
    process.exit(1);
  }
};

listCollections();
