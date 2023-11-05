const express = require("express")
const {addElement, getAllData,deleteElements,getParagon} = require("../controllers/productController.ts")
const {authenticateUser} = require("../middleware/authentication")

const router = express.Router()


router.post("/addElement",authenticateUser,addElement)
router.get("/allData",authenticateUser,getAllData)
router.delete("/deleteElements",authenticateUser,deleteElements)
router.get("/paragon",authenticateUser,getParagon)

module.exports = router