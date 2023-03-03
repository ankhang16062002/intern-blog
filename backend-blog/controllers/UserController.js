const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorMessage = require("../utils/error-message");
const UserModel = require("../models/UserModel");

//get all user - admin
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await UserModel.find({}).sort({ _id: -1 });

  res.status(200).json({
    success: true,
    message: "Lấy tất cả người dùng thành công.",
    users,
  });
});

//get user - admin
exports.getUser = catchAsyncError(async (req, res, next) => {
  const userId = req.params.id;
  const user = await UserModel.findById(userId);

  if (!user)
    return next(
      new ErrorMessage("Không có người dùng bạn đang tìm kiếm.", 400)
    );

  const { idSocial, ...info } = user._doc;

  res.status(200).json({
    success: true,
    message: "Lấy thông tin người dùng thành công.",
    info,
  });
});

//update user - user
exports.updateUser = catchAsyncError(async (req, res, next) => {
  const userId = req.params.id;
  const { name, avatar, gender, email, phone } = req.body;

  if (req.body.idSocial)
    return next(
      new ErrorMessage("Bạn không thể cập nhật id mạng xã hội.", 400)
    );

  if (req.body.role)
    return next(new ErrorMessage("Bạn không thể đổi vai trò của mình.", 400));

  if (req.body.notifycations)
    return next(new ErrorMessage("Bạn không thể đổi thông báo của mình.", 400));

  let options = {};
  if (name) options.name = name;
  if (avatar) options.avatar = avatar;
  if (gender) options.gender = gender;
  if (email) options.email = email;
  if (phone) options.phone = Number(phone);

  const userUpdate = await UserModel.findByIdAndUpdate(
    userId,
    {
      $set: options,
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Cập nhật profile thành công.",
    userUpdate,
  });
});

//delete user - admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const userId = req.params.id;
  const user = await UserModel.findById(userId);

  if (!user)
    return next(new ErrorMessage("Không có người dùng bạn muốn xóa.", 400));

  await UserModel.findByIdAndDelete(userId);

  res.status(200).json({
    success: true,
    message: "Bạn đã xóa người dùng thành công.",
  });
});
