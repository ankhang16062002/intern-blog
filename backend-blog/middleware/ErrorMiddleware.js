const errorMessage = require("../utils/error-message");

const errorMiddleware = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.message = error.message || "Server error internal";

  //custom message duplicate key error
  if (error.code === 11000) {
    error = new errorMessage(
      `Trường ${Object.keys(error.keyValue)} phải là duy nhất`,
      400
    );
  }

  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message,
  });
};

module.exports = errorMiddleware;
