const router = require("express").Router();
const {
  createComment,
  updateComment,
  updateLikeandUnlikeComment,
  deleteComment,
  getComment,
  getAllCommentsByPost,
  getAllRepliesByComment,
} = require("../controllers/CommentController");

const { checkAuthenicated } = require("../middleware/AuthMiddleware");

router.route("/").post(checkAuthenicated, createComment);

router
  .route("/like/:commentId")
  .put(checkAuthenicated, updateLikeandUnlikeComment);

router.route("/allComments/:postId").get(getAllCommentsByPost);

router.route("/allReplies/:commentId").get(getAllRepliesByComment);

router
  .route("/:commentId")
  .get(getComment)
  .put(checkAuthenicated, updateComment)
  .delete(checkAuthenicated, deleteComment);

module.exports = router;
