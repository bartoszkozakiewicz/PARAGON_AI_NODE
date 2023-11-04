const CustomError = require('../errors');
const {verifyJWT, attachCookiesToResponse} = require("../utils/jwt")
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authenticateUser = async(req,res,next) =>{
    const { refreshToken, accessToken } = req.signedCookies;
    console.log("authenticate middleware".refreshToken,accessToken)

    try{
        if(accessToken){
            const payload = verifyJWT(accessToken)
            console.log("payload", payload)
            req.user = payload.user
            return next()

        }

        //Jeżeli nie ma access token 
        if(refreshToken){

            const payload = verifyJWT(refreshToken)
            
            const existingToken = await prisma.token.findUnique({
                where:{
                    userId: payload.user.id
                }
            })
            console.log("Eisting token: ",existingToken)
            if(!existingToken){
                throw new CustomError.UnauthenticatedError("Authentication failed")
            }
            
            attachCookiesToResponse({res,user:payload.user,refreshToken: existingToken.refreshToken})
            req.user = payload.user
            return next()
        }
        throw new CustomError.UnauthenticatedError("Authentication failed")

    }catch(err){
        throw new CustomError.UnauthenticatedError("Authentication failed")
    }

}

module.exports = {
    authenticateUser
}