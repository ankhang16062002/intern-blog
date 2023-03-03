const router = require("express").Router();
const { getTopics } = require("../controllers/TopicController");

router.route("/all").get(getTopics);

module.exports = router;
