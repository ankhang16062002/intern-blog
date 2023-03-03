const CategoryModel = require("../models/CategoryModel");
const catchAsyncError = require("../middleware/catchAsyncError");

// get all categories for client
exports.getCategories = catchAsyncError(async (req, res, next) => {
  const categories = await CategoryModel.find({});
  res.json({
    success: true,
    categories,
  });
});

//get category of topic
exports.getCategoriesOfTopic = catchAsyncError(async (req, res, next) => {
  const topic = req.params.topic;
  const categories = await CategoryModel.find({
    topic: topic,
  });

  res.json({
    success: true,
    categories,
  });
});
