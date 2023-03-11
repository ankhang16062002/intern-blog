const router = require("express").Router();

const {
  createPost,
  getPost,
  getPosts,
  getPostsAdmin,
  getRandomPosts,
  getLastestPosts,
  getPostBestLike,
  getPostReadMany,
  updatePost,
  deletePost,
  updateLikePost,
  deleteAllPosts,
  updateUserSaved,
  deleteAllPostSaved,
  getAllPostSaved,
  saveImgToCloudnary,
} = require("../controllers/PostController");

const {
  checkAdmin,
  checkAuthenicated,
} = require("../middleware/AuthMiddleware");

router.route("/").post(checkAuthenicated, checkAdmin, createPost);

router.route("/all").get(getPosts);
router.route("/random").get(getRandomPosts);
router.route("/lastest").get(getLastestPosts);
router.route("/bestlike").get(getPostBestLike);
router.route("/readmany").get(getPostReadMany);

router
  .route("/:slug")
  .get(getPost)
  .put(checkAuthenicated, checkAdmin, updatePost)
  .delete(checkAuthenicated, checkAdmin, deletePost);

router.route("/like/:slug").put(checkAuthenicated, updateLikePost);
router
  .route("/userSaved/all/:userId")
  .get(checkAuthenicated, getAllPostSaved)
  .delete(checkAuthenicated, deleteAllPostSaved);

router.route("/userSaved/:slug").put(checkAuthenicated, updateUserSaved);

router.route("/warning/delete").delete(deleteAllPosts);
router
  .route("/save/cloudinary")
  .post(checkAuthenicated, checkAdmin, saveImgToCloudnary);
router.route("/all/admin").get(getPostsAdmin, checkAuthenicated, checkAdmin);
module.exports = router;
