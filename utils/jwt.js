const jwt = require("jsonwebtoken")


const verifyJWT = (token) => jwt.verify(token,process.env.JWT_SECRET)

const createJWT = ({payload}) =>{
    console.log("JWT",process.env.JWT_SECRET)
    const token = jwt.sign(payload,process.env.JWT_SECRET)
    return token
}

const attachCookiesToResponse = ({res,user,refreshToken})=>{

    const accessTokenJWT = createJWT({payload:{user}})
    const refreshTokenJWT = createJWT({payload:{user,refreshToken}})

    const oneDay = 1000 * 60 * 60 * 24;
    const month = 1000 * 60 * 60 * 24 * 30;

    //attach accessToken
    res.cookie("accessToken",accessTokenJWT,{
        http:true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        expires: new Date(Date.now() + oneDay),
    })
    console.log("Dodałem accessToken",accessTokenJWT)
    //attach accessToken
    res.cookie("refreshToken",refreshTokenJWT,{
        http:true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        expires: new Date(Date.now() + month),
    })
}

module.exports = {
    createJWT,
    attachCookiesToResponse,
    verifyJWT
}