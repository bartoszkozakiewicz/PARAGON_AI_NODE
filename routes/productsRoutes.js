const express = require("express")
const {addElement} = require("../controllers/productController.ts")
const {authenticateUser} = require("../middleware/authentication")

const router = express.Router()


router.post("/addElement",authenticateUser,addElement)

module.exports = router