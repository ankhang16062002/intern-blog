const mongoose = require("mongoose");

const TopicSchema = new mongoose.Schema(
  {
    title: String,
    slug: String,
  },
  {
    timestamps: true,
  }
);

const TopicModel = mongoose.model("Topic", TopicSchema);

module.exports = TopicModel;
