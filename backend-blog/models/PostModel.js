const mongoose = require("mongoose");
const generateSlug = require("../utils/generate-slug");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Vui lòng nhập title của bài viết."],
      trim: true,
      unique: [true, "Titlte của bài viết phải là duy nhất."],
    },
    imageTitle: {
      type: Object,
      required: [true, "Bài viết bắt buộc phải có imageTitle."],
    },
    slug: {
      type: String,
      unique: [true, "Slug của danh mục phải là duy nhất."],
    },
    content: {
      type: String,
      required: [true, "Vui lòng nhập nội dung của bài viết."],
      trim: true,
    },
    topic: {
      type: String,
      required: [true, "Mỗi bài viết bắt buộc phải có một chủ đề."],
    },
    category: {
      type: String,
      required: [true, "Mỗi bài viết bắt buộc phải có một danh mục."],
    },
    numOfLikes: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Array,
      default: [],
    },
    numOfComments: {
      type: Number,
      default: 0,
    },
    numOfViews: {
      type: Number,
      default: 0,
    },
    userSaved: {
      type: Array,
      default: [],
    },
    listImg: {
      type: Array,
      default: [],
    },
    timeRead: {
      type: Number,
      default: 8,
    },
  },
  {
    timestamps: true,
  }
);

//generate slug before save
PostSchema.pre("save", function (next) {
  this.slug = generateSlug(this.title);
  next();
});

const PostModel = mongoose.model("Post", PostSchema);

module.exports = PostModel;
