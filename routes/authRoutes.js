const express = require("express")
const {login,logout,register,forgotPassword}  = require("../controllers/authController")
const {authenticateUser} = require("../middleware/authentication")

const router = express.Router()


router.post('/login', login);
router.post("/logout",logout)
router.route("/register").post(register)
router.route("/forgot-password").post(forgotPassword)



module.exports = router