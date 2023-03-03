const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("database connect successfully!");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDatabase;
