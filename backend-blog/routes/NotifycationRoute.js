const router = require("express").Router();
const {
  createNotification,
  refreshSaw,
  refreshSawAll,
  getAllNotifyCation,
} = require("../controllers/NotifycationController");

const { checkAuthenicated } = require("../middleware/AuthMiddleware");

router.route("/").post(checkAuthenicated, createNotification);
router.route("/all").put(checkAuthenicated, refreshSawAll);

router.route("/all/:userId").get(checkAuthenicated, getAllNotifyCation);

router.route("/:id").put(checkAuthenicated, refreshSaw);

module.exports = router;
