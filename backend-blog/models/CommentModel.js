const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    userSender: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Bình luận bắt buộc phải có người gửi."],
      ref: "User",
    },
    userRecevied: {
      type: Object,
    },
    content: {
      type: String,
      required: [true, "Bình luận bắt buộc phải có nội dung"],
    },
    numOfLikes: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Array,
      default: [],
    },
    numOfUnlikes: {
      type: Number,
      default: 0,
    },
    unlikes: {
      type: Array,
      default: [],
    },
    numOfReplies: {
      type: Number,
      default: 0,
    },
    postId: {
      type: String,
      required: [true, "Mỗi bình luận phải thuộc một bài viết"],
    },
    reaction: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const CommentModel = mongoose.model("Comment", CommentSchema);

module.exports = CommentModel;
