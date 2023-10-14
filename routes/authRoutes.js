const express = require("express")
const {login,register,forgotPassword}  = require("../controllers/authController")

const router = express.Router()


router.post('/login', login);
router.route("/register").post(register)
router.route("/forgot-password").post(forgotPassword)



module.exports = router