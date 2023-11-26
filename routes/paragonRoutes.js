const express = require("express");
const {
  getParagonData,
  getParagonImages,
} = require("../controllers/paragonController");
const { authenticateUser } = require("../middleware/authentication");
const router = express.Router();

router.post("/getParagon", authenticateUser, getParagonData);
router.get("/getImages", authenticateUser, getParagonImages);

module.exports = router;
