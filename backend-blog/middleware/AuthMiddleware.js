const UserModel = require("../models/UserModel");
const catchAsyncError = require("../middleware/catchAsyncError");
const errorMessage = require("../utils/error-message");

exports.checkAuthenicated = catchAsyncError(async (req, res, next) => {
  const dataPassport = req.session.passport;
  console.log(dataPassport);
  if (dataPassport) {
    const idSocial = dataPassport.user.idSocial;
    const user = await UserModel.findOne({ idSocial });
    if (user) {
      req.user = user;
      next();
    } else
      return next(
        new errorMessage("Rất tiếc, phiên đăng nhập của bạn hết hạn.", 400)
      );
  } else {
    return next(new errorMessage("Bạn chưa đăng nhập, hãy đăng nhập.", 400));
  }
});

exports.checkAdmin = (req, res, next) => {
  if (req.user.role === "admin") next();
  else
    return next(
      new errorMessage("Bạn không có quyền là admin để xác nhận.", 400)
    );
};
