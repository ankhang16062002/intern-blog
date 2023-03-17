const mongoose = require("mongoose");

const NotifycationSchema = new mongoose.Schema(
  {
    userSender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Mỗi thông báo phải có người gửi"],
    },
    userRecevied: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Mỗi thông báo phải có người nhận"],
    },
    type: {
      type: String,
      required: [true, "Loại thông báo là bắt buộc"],
    },
    saw: {
      type: Boolean,
      default: false,
    },
    postSlug: {
      type: String,
      default: "",
    },
    commentId: {
      type: String,
      default: "",
    },
    replyId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const NotifycationModel = mongoose.model("Notifycation", NotifycationSchema);

module.exports = NotifycationModel;
