const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    title: String,
    slug: String,
    topic: String,
  },
  {
    timestamps: true,
  }
);

const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = CategoryModel;
