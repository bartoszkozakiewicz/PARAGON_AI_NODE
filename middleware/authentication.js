const CustomError = require('../errors');

const authenticateUser = (req,res,next) =>{
    if (true){
        throw new CustomError.UnauthenticatedError('Authentication Invalid');
    }
    else{
        next()
    }
}