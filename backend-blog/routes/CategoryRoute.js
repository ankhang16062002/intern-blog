const router = require("express").Router();
const {
  getCategories,
  getCategoriesOfTopic,
} = require("../controllers/CategoryController");

router.route("/all").get(getCategories);
router.route("/all/:topic").get(getCategoriesOfTopic);

module.exports = router;
