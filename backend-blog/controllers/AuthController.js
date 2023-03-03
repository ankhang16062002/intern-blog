const ErrorMessage = require("../utils/error-message");

//login success
exports.loginSuccess = (req, res, next) => {
  if (req.session.passport) {
    const { name, avatar, idSocial, role, _id: id } = req.session.passport.user;
    //callback function in passport is called before
    res.status(200).json({
      success: true,
      message: "Bạn đã đăng nhập thành công",
      info: {
        name,
        avatar,
        idSocial,
        role,
        id,
      },
    });
  } else {
    res.status(200).json({
      success: false,
      message: "Bạn chưa đăng nhập",
    });
  }
  return;
};

//login failer
exports.loginFailure = (req, res, next) => {
  return next(next(new ErrorMessage("Đăng nhập thất bại", 500)));
};

//logout user
exports.logoutUser = (req, res, next) => {
  req.session.destroy();

  res.status(200).json({
    success: true,
    message: "Bạn đã đăng xuất thành công.",
  });
};
