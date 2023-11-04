const express = require("express")
const {addElement, getAllData,deleteElements} = require("../controllers/productController.ts")
const {authenticateUser} = require("../middleware/authentication")

const router = express.Router()


router.post("/addElement",authenticateUser,addElement)
router.get("/allData",authenticateUser,getAllData)
router.delete("/deleteElements",authenticateUser,deleteElements)

module.exports = router