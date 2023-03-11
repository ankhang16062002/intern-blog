const PostModel = require("../models/PostModel");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");
const generateSlug = require("../utils/generate-slug");
const ErrorMessage = require("../utils/error-message");
const UserModel = require("../models/UserModel");
const cloudinary = require("cloudinary");

//create post model - admin
exports.createPost = catchAsyncError(async (req, res, next) => {
  const { title, content, topic, category, timeRead, imageTitle, listImg } =
    req.body;

  //update image to cloudinary
  const myClould = await cloudinary.v2.uploader.upload(imageTitle, {
    folder: "intern-blog",
  });

  console.log("run1");

  const post = new PostModel({
    title,
    content,
    topic,
    category,
    timeRead,
    content,
    imageTitle: {
      url: myClould.secure_url,
      public_id: myClould.public_id,
    },
    listImg,
  });

  const newPost = await post.save();

  res.status(200).json({
    success: true,
    message: "Bài viết được tạo thành công.",
    newPost,
  });
});

//get post by slug
exports.getPost = catchAsyncError(async (req, res, next) => {
  const slug = req.params.slug;
  const post = await PostModel.findOne({ slug });

  post.numOfViews++;
  await post.save({ validateBeforeSave: false });

  res.json({
    success: true,
    post,
  });
});

// get all posts for client
exports.getPosts = catchAsyncError(async (req, res, next) => {
  const resultPerPage = 8;

  const apiFeatures = new ApiFeatures(
    PostModel.find({}).sort({ _id: -1 }),
    req.query
  )
    .search()
    .filter();

  const posts = await apiFeatures.query;
  const postCount = posts.length;

  apiFeatures.pagination(resultPerPage);
  let filteredPosts = await apiFeatures.query.clone();

  res.json({
    success: true,
    filteredPosts,
    resultPerPage,
    postCount,
  });
});

//get all posts admin
exports.getPostsAdmin = catchAsyncError(async (req, res, next) => {
  const posts = await PostModel.find({}).sort({ _id: -1 });

  res.json({
    success: true,
    posts,
  });
});

//get RandomPosts
exports.getRandomPosts = catchAsyncError(async (req, res, next) => {
  const limit = 6;
  const randomPosts = await PostModel.aggregate([
    {
      $sample: { size: limit },
    },
  ]);

  res.status(200).json({
    success: true,
    randomPosts,
  });
});

//get posts lasest
exports.getLastestPosts = catchAsyncError(async (req, res, next) => {
  const resultPerPage = 8;
  const apiFeatures = new ApiFeatures(
    PostModel.find({}).sort({ _id: -1 }),
    req.query
  );

  const postCount = await PostModel.countDocuments();

  apiFeatures.pagination(resultPerPage);
  let lastestPosts = await apiFeatures.query.clone();

  res.json({
    success: true,
    lastestPosts,
    resultPerPage,
    postCount,
  });
});

//get posts is best liked
exports.getPostBestLike = catchAsyncError(async (req, res, next) => {
  const limit = 3;
  const apiFeatures = new ApiFeatures(
    PostModel.find({}).sort({ numOfLikes: -1 }).limit(limit),
    {}
  );
  const bestLikePosts = await apiFeatures.query;

  res.status(200).json({
    success: true,
    bestLikePosts,
  });
});

//get posts is best liked
exports.getPostReadMany = catchAsyncError(async (req, res, next) => {
  const limit = 4;
  const apiFeatures = new ApiFeatures(
    PostModel.find({}).sort({ numOfViews: -1 }).limit(limit),
    {}
  );
  const readManyPosts = await apiFeatures.query;

  res.status(200).json({
    success: true,
    readManyPosts,
  });
});

// update title - slug -img ... post - admin
exports.updatePost = catchAsyncError(async (req, res, next) => {
  const slug = req.params.slug;

  //if img, delete img from clouldnary

  const post = await PostModel.findOne({ slug });
  if (!post)
    return next(new ErrorMessage("Không có bài viết bạn muốn cập nhật.", 400));

  if (req.body.title) {
    req.body = { ...req.body, slug: generateSlug(req.body.title) };
  }

  const updatePost = await PostModel.updateOne(req.body);

  res.status(200).json({
    success: true,
    message: "Bạn đã cập nhật bài viết thành công.",
    updatePost,
  });
});

//update like post
exports.updateLikePost = catchAsyncError(async (req, res, next) => {
  const { userId } = req.body;
  const slug = req.params.slug;

  const post = await PostModel.findOne({ slug });
  if (!post)
    return next(new ErrorMessage("Không có bài viết bạn muốn cập nhật.", 400));

  if (post.likes.includes(userId)) {
    if (post.numOfLikes !== 0) {
      post.likes = post.likes.filter((like) => like !== userId);
      post.numOfLikes--;
    }
  } else {
    post.likes.push(userId);
    post.numOfLikes++;
  }

  //re-save to database
  await post.save();

  res.status(200).json({
    success: true,
    message: `Bạn đã ${
      post.likes.includes(userId) ? "thích" : "bỏ thích"
    } bài viết thành công.`,
    liked: post.likes.includes(userId),
  });
});

//update userSave of post
exports.updateUserSaved = catchAsyncError(async (req, res, next) => {
  const slug = req.params.slug;
  const { userId } = req.body;

  const user = await UserModel.findById(userId);
  if (!user) return next(new ErrorMessage("Không có người dùng.", 400));

  const post = await PostModel.findOne({ slug });
  if (!post) return next(new ErrorMessage("Không tìm thấy bài viết.", 400));

  //update userSaved
  if (post.userSaved.includes(userId)) {
    post.userSaved = post.userSaved.filter((id) => id !== userId);
    user.numberPostSaved--;
  } else {
    post.userSaved.push(userId);
    user.numberPostSaved++;
  }

  //re-save to database
  await post.save({ validateBeforeSave: false });
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: `Bạn đã ${
      post.userSaved.includes(userId) ? "lưu" : "bỏ lưu"
    } bài viết thành công.`,
    saved: post.userSaved.includes(userId),
  });
});

//get all post userSaved
exports.getAllPostSaved = catchAsyncError(async (req, res, next) => {
  const userId = req.params.userId;
  const user = await UserModel.findById(userId);
  if (!user) return next(new ErrorMessage("Không có người dùng.", 400));

  const posts = await PostModel.find({
    userSaved: {
      $in: userId,
    },
  })
    .sort({ _id: -1 })
    .select({ title: 1, slug: 1, imageTitle: 1, _id: 1, category: 1 });

  res.status(200).json({
    success: true,
    message: "Lấy tất cả bài viết đã lưu của người dùng thành công.",
    posts,
  });
});

//delete all post userSaved
exports.deleteAllPostSaved = catchAsyncError(async (req, res, next) => {
  const userId = req.params.userId;
  const user = await UserModel.findById(userId);
  if (!user) return next(new ErrorMessage("Không có người dùng.", 400));

  await PostModel.updateMany(
    {
      userSaved: {
        $in: userId,
      },
    },
    {
      $pull: {
        userSaved: userId,
      },
    }
  );

  user.numberPostSaved = 0;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Xóa tất cả bài viết đã lưu thành công",
  });
});

// delete post - admin
exports.deletePost = catchAsyncError(async (req, res, next) => {
  const slug = req.params.slug;

  const post = await PostModel.findOne({ slug });
  if (!post)
    return next(new ErrorMessage("Không có bài viết bạn muốn xóa.", 400));

  await PostModel.deleteOne({ slug });

  //delete image title in cloudinary
  await cloudinary.v2.uploader.destroy(post.imageTitle.public_id);

  //delete image in clouldnary
  for (let i = 0; i < post.listImg.length; i++) {
    await cloudinary.v2.uploader.destroy(post.listImg[i]);
  }

  //delete all comment of post after ***

  res.status(200).json({
    success: true,
    message: "Bạn đã xóa bài viết thành công.",
  });
});

//delete all post ----- warning
exports.deleteAllPosts = catchAsyncError(async (req, res, next) => {
  await PostModel.deleteMany({});
  res.status(200).json({
    success: true,
    message: "Bạn đã xóa tất cả bài viết thành công",
  });
});

//save img post to cloudinary
exports.saveImgToCloudnary = catchAsyncError(async (req, res, next) => {
  const myClould = await cloudinary.v2.uploader.upload(req.body.dataImage, {
    folder: "imagePosts",
  });

  res.status(200).json({
    success: true,
    message: "upload ảnh đến clouldinary thành công",
    public_id: myClould.public_id,
    url: myClould.secure_url,
  });
});
