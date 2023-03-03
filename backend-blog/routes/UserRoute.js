const router = require("express").Router();
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/UserController");

const {
  checkAdmin,
  checkAuthenicated,
} = require("../middleware/AuthMiddleware");

router.route("/all").get(checkAuthenicated, checkAdmin, getAllUsers);

router
  .route("/:id")
  .get(checkAuthenicated, getUser)
  .put(checkAuthenicated, updateUser)
  .delete(checkAuthenicated, checkAdmin, deleteUser);

module.exports = router;
