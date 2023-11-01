const express = require("express")
const {showMe,updateUser} = require("../controllers/userController")
const {authenticateUser} = require("../middleware/authentication")

const router = express.Router()


router.route("/showMe").get(authenticateUser,showMe)


module.exports = router