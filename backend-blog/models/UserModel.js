const mongoose = require("mongoose");
const { isEmail } = require("validator");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên là trường bắt buộc của người dùng."],
      trim: true,
      maxlength: [30, "Tên phải không quá 20 kí tự"],
    },
    avatar: {
      type: String,
      default: "",
    },
    idSocial: {
      type: String,
    },
    emailAuth: {
      type: String,
    },
    phoneAuth: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    gender: {
      type: String,
      enum: ["nam", "nữ"],
    },
    email: {
      type: String,
      validate: [
        isEmail,
        "Email mà bạn nhập không đúng định dạng, vui lòng thử lại.",
      ],
    },
    phone: {
      type: Number,
      minlength: [8, "Số điện thoại tối thiểu 8 số."],
      maxlength: [13, "Số điện thoại tối thiểu 13 số."],
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
