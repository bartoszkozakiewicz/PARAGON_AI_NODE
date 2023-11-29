const express = require("express");
const {
  addElement,
  getAllData,
  deleteElements,
  getParagon,
  getNeededData,
  deleteShopping,
  getSum,
} = require("../controllers/productController");
const { authenticateUser } = require("../middleware/authentication");

const router = express.Router();

router.post("/addElement", authenticateUser, addElement);
router.get("/allData", authenticateUser, getAllData);
router.delete("/deleteElements", authenticateUser, deleteElements);
router.delete("/deleteShopping", authenticateUser, deleteShopping);
router.get("/paragon", authenticateUser, getParagon);
router.get("/neededData", authenticateUser, getNeededData);
router.get("/sum", authenticateUser, getSum);

module.exports = router;
