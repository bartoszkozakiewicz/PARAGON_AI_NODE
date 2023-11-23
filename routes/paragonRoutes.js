const express = require("express")
const {getParagonData} = require("../controllers/paragonController")
const {authenticateUser} = require("../middleware/authentication")
const router = express.Router()


router.post("/getParagon",authenticateUser,getParagonData)


module.exports = router