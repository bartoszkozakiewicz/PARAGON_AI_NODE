const { StatusCodes } = require('http-status-codes');


const getAllUsers = async (req,res) =>{
    console.log("getAllUSers")
}

const showMe = async (req,res) =>{
    res.status(StatusCodes.OK).json({user:req.user})
}

const updateUser = async (req,res) =>{
    console.log("UpdateUser")
}


module.exports ={
    getAllUsers,
    showMe,
    updateUser
}