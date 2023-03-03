const TopicModel = require("../models/TopicModel");
const catchAsyncError = require("../middleware/catchAsyncError");

// get topics for client
exports.getTopics = catchAsyncError(async (req, res, next) => {
  const topics = await TopicModel.find({});

  res.json({
    success: true,
    topics,
  });
});
