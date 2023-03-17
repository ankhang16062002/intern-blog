const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorMessage = require("../utils/error-message");
const CommentModel = require("../models/CommentModel");
const PostModel = require("../models/PostModel");

//create comment
exports.createComment = catchAsyncError(async (req, res, next) => {
  const { postId } = req.query;
  const { content, userSender, reaction, userRecevied, state } = req.body;

  const post = await PostModel.findById(postId);

  if (!post) {
    return next(new ErrorMessage("Không tìm thấy bài viết", 400));
  }

  const comment = new CommentModel({
    userSender,
    userRecevied,
    content,
    state,
    postId,
    reaction,
  });

  const newComment = await comment.save();
  post.numOfComments++;

  if (reaction) {
    const oldComment = await CommentModel.findById(reaction);
    if (!oldComment)
      return next(new ErrorMessage("Không tìm thấy bình luận cũ", 400));
    oldComment.numOfReplies++;

    //update old comment
    await oldComment.save();
  }
  //update post
  await post.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Bạn đã tạo bình luận thành công.",
    newComment,
  });
});

//get comment
exports.getComment = catchAsyncError(async (req, res, next) => {
  const { commentId } = req.params;

  const comment = await CommentModel.findById(commentId);

  res.status(200).json({
    success: true,
    message: "Lấy thông tin của bình luận thành công",
    comment,
  });
});

//update comment - user
exports.updateComment = catchAsyncError(async (req, res, next) => {
  const { userId, content } = req.body;
  const commentId = req.params.commentId;
  const comment = await CommentModel.findById(commentId);

  if (userId !== comment.user.toString())
    return next(
      new ErrorMessage(
        "Bạn không được phép cập nhật bình luận của người khác.",
        400
      )
    );

  const newComment = await CommentModel.findByIdAndUpdate(
    commentId,
    {
      $set: { content },
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Bạn đã cập nhật bình luận thành công.",
    newComment,
  });
});

//update like and unlike comment post
exports.updateLikeandUnlikeComment = catchAsyncError(async (req, res, next) => {
  const { commentId } = req.params;
  let { like, unlike } = req.query;
  const { userId } = req.body;

  like = like === "true" ? true : false;
  unlike = unlike === "true" ? true : false;

  if (like && unlike)
    return next(new ErrorMessage("Không thể vừa like vừa unlike.", 400));

  const comment = await CommentModel.findById(commentId);

  if (comment.likes.includes(userId) && !comment.unlikes.includes(userId)) {
    if (like && !unlike)
      return res.status(200).json({
        success: false,
        message: "Like và unlike không thay đổi.",
      });

    comment.likes = comment.likes.filter((user) => user !== userId);
    comment.numOfLikes--;
    if (unlike) {
      comment.unlikes.push(userId);
      comment.numOfUnlikes++;
    }
  } else if (
    !comment.likes.includes(userId) &&
    comment.unlikes.includes(userId)
  ) {
    if (!like && unlike)
      return next(new ErrorMessage("Like và unlike không thay đổi..", 400));

    comment.unlikes = comment.unlikes.filter((user) => user !== userId);
    comment.numOfUnlikes--;
    if (like) {
      comment.likes.push(userId);
      comment.numOfLikes++;
    }
  } else {
    if (!like && !unlike)
      return next(new ErrorMessage("Like và unlike không thay đổi..", 400));

    if (like) {
      comment.likes.push(userId);
      comment.numOfLikes++;
    } else {
      comment.unlikes.push(userId);
      comment.numOfUnlikes++;
    }
  }

  //re-save to database
  await comment.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Cập nhật like và unlike thành công.",
  });
});

//delete comment - user
exports.deleteComment = catchAsyncError(async (req, res, next) => {
  const { userId, postId } = req.query;
  const commentId = req.params.commentId;
  const comment = await CommentModel.findById(commentId);

  if (userId !== comment.userSender.toString())
    return next(
      new ErrorMessage("Bạn không được phép xóa bình luận của người khác.", 400)
    );

  await CommentModel.findByIdAndDelete(commentId);

  const post = await PostModel.findById(postId);
  if (post.numOfComments === 0)
    return next(
      new ErrorMessage("Bạn đã cố tình xóa bình luận không tồn tại.")
    );
  post.numOfComments--;

  await post.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Bạn đã xóa bình luận thành công.",
  });
});

//get all comment of post
exports.getAllCommentsByPost = catchAsyncError(async (req, res, next) => {
  const postId = req.params.postId;
  const comments = await CommentModel.find({
    postId,
    reaction: "",
  })
    .populate("userSender", { name: 1, avatar: 1, _id: 1 })
    .sort({ _id: -1 });

  res.status(200).json({
    success: true,
    message: "Lấy tất cả bình luận của bài viết thành công.",
    comments,
  });
});

//get all reply a one comment
exports.getAllRepliesByComment = catchAsyncError(async (req, res, next) => {
  const commentId = req.params.commentId;
  const postId = req.query.postId;
  const replies = await CommentModel.find({
    postId,
    reaction: commentId,
  })
    .populate("userSender", { name: 1, avatar: 1, _id: 1 })
    .sort({ _id: -1 });

  res.status(200).json({
    success: true,
    message: "Lấy tất cả replies của bình luận thành công.",
    replies,
  });
});
