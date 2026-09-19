const jwt = require('jsonwebtoken');
const tokenBlackListModel  = require("../models/blacklist.model");
const config = require("../config/config")

async function authUser(req , res , next) {
    const token =  req.cookies.token;

    if(!token){
        return res.status(401).json({
            message : "token is not availble"
        });
    }
    
    const isTokenIsBlacklisted = await tokenBlackListModel.findOne({token});

    if(isTokenIsBlacklisted){
        return res.status(401).json({
            message : "token is blacklisted "
        }); 
    }
    try {
        const decoded = jwt.verify(token , process.env.JWT_KEY  );
        req.user = decoded;


        next()

    } catch (error) {
        console.log(`error in authMiddleware ${error}`)
        return res.status(401).json({
            message : "error in middleware"
        });
    }
    
}


module.exports= {
    authUser,
}