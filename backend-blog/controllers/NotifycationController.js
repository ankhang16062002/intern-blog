const NotifycationModel = require("../models/NotifycationModel");
const UserModel = require("../models/UserModel");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorMessage = require("../utils/error-message");

//create notifycation
exports.createNotification = catchAsyncError(async (req, res, next) => {
  const { userSender, type, userRecevied, postSlug, commentId, replyId } =
    req.body;
  const user = await UserModel.findById(userRecevied);

  if (!user) {
    return next(new ErrorMessage("Không tìm ra người để nhận thông báo.", 400));
  }

  const newNotifycation = new NotifycationModel({
    userSender,
    userRecevied,
    type,
    postSlug: postSlug || "",
    commentId: commentId || "",
    replyId,
  });

  //save to database
  const notifycation = await newNotifycation.save();
  user.numberNewNotifycation++;

  //resave user
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Bạn đã tạo thông báo thành công.",
    notifycation,
  });
});

//get all notifycation of user
exports.getAllNotifyCation = catchAsyncError(async (req, res, next) => {
  const { userId } = req.params;
  const notifycations = await NotifycationModel.find({
    userRecevied: userId,
  })
    .sort({ _id: -1 })
    .populate("userSender");

  res.status(200).json({
    success: true,
    message: "Lấy tất cả thông báo thành công.",
    notifycations,
  });
});

//reset saw to true
exports.refreshSaw = catchAsyncError(async (req, res, next) => {
  const notifycationId = req.params.id;
  const notifycation = await NotifycationModel.findById(notifycationId);

  if (!notifycation) {
    return next(new ErrorMessage("Không tìm ra thông báo.", 400));
  }

  notifycation.saw = true;

  //resave notifycation
  await notifycation.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Bạn đã xem thông báo.",
  });
});

//reset save to true all notification
exports.refreshSawAll = catchAsyncError(async (req, res, next) => {
  await NotifycationModel.updateMany(
    { saw: false },
    {
      $set: {
        saw: true,
      },
    }
  );

  res.status(200).json({
    success: true,
    message: "Bạn đã chọn đã xem tất cả thông báo.",
  });
});
