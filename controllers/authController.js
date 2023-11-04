const {attachCookiesToResponse} = require("../utils/jwt")
const bcrypt = require("bcrypt")
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const CustomError = require('../errors');
const crypto = require('crypto');
const {StatusCodes} = require("http-status-codes")

const login = async (req,res) =>{
    console.log(req.body)
    const {email,password} = req.body
    console.log("LOGIN-LOGIN")
    if(!email || !password){
        throw new CustomError.UnauthenticatedError("Please provide email and password")
    }
    
    //CHECK USER
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    console.log(user)
    if(!user){
        throw new CustomError.UnauthenticatedError("Invalid credentials")
    }

    //CHECK PASSWORD
    const isPasswordCorrect = await bcrypt.compare(password,user.password)
    if(!isPasswordCorrect){
        throw new CustomError.UnauthenticatedError("Invalid credentials")
    }

    console.log(isPasswordCorrect)
    //Create token with appropriate data and attach it to cookies

    //Data that will be held in tokens
    const tokenData =  { name: user.name,email:user.email, userId: user.id, role: user.role }


    const existingToken = await prisma.token.findUnique({
        where: {userId: user.id}
    })

    // If there is token, check if it is valid, if so then attach cookies with user data
    let refreshToken = ""
    if(existingToken){

        const {isValid} = existingToken
        if(!isValid){
          throw new CustomError.UnauthenticatedError("Invalid Credentials")
        }
        refreshToken = existingToken.refreshToken

        attachCookiesToResponse({res,user:tokenData,refreshToken})
        res.status(StatusCodes.OK).json({ user: tokenData });
        return
    }

    //If there is no token yet, then create one
    if (!existingToken){ 
        refreshToken = crypto.randomBytes(40).toString("hex")
        const userAgent = req.headers["user-agent"]
        const ip = req.ip

        await prisma.token.create({
            data:{
                userId:user.id,
                refreshToken:refreshToken,
                ip:ip,
                userAgent:userAgent
            }
        })

        attachCookiesToResponse({res,user:tokenData,refreshToken})
        res.status(StatusCodes.OK).json({user:tokenData});
        return

    }

}

const logout = async (req,res) =>{
    console.log("USER",req.body.userId)
    try{
        await prisma.token.delete({
            where:{
                userId:req.body.userId
            }
        })
    }catch(err){
        throw new CustomError.BadRequestError("Something went wrong")
    }

    // Clear the accessToken and refreshToken cookies
    res.cookie('accessToken', 'logout', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now()),
    });
    res.cookie('refreshToken', 'logout', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now()),
    });
    res.status(200).json({msg:"User logged out"})
}

const register = async (req,res) =>{
    const {name,email,password} = req.body


    if (!name || !email || !password){
        throw new CustomError.BadRequestError("Please provide all credentials...")
    }

    const userExists = await prisma.user.findUnique({
        where:{
            email
        }
    })
    if(userExists){
        throw new CustomError.BadRequestError("User with given email already exists")
    }


    const hashedPass = await bcrypt.hash(password,10)

    const user = await prisma.user.create({
        data:{
            name,
            email,
            password: hashedPass
        }
    })

    if(user){
        attachCookiesToResponse({res,user:{name,email},refreshToken:"asd"})
        res.status(200).json({msg:"Successfully registered"})
    }
    else{
        throw new CustomError.UnauthenticatedError("Something went wrong")
    }
    
}

const forgotPassword = async (req,res) =>{
    res.status(200).json({msg:"forgot password"})
}

module.exports = {
    login,
    logout,
    register,
    forgotPassword
}