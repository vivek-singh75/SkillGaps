const userModel = require('../models/userModel');
const tokenBlackListModel =  require("../models/blacklist.model")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/config");

/**
 * 
 * @name registerUserController
 * @api  /api/auth/register
 * @action this api is used to register new user 
 */
async function registerUserController(req , res) {
    const {username ,  email , password} = req.body;

    if(!username || !email || !password){
        return res.status(403).json({ message : "enter all details " });
    }

    const isUserAlreadyExist = await userModel.findOne({
        $or: [{username}, {email}]
    });

    if(isUserAlreadyExist){
        return res.status(201).json({message : "user already exist"});
    }

    const hash =await bcrypt.hash(password , 10);

    const user = await userModel.create({
        username,
        email,
        password : hash
    });

    const token = jwt.sign({
        userId : user._id
    }, config.JWT_KEY, 
        {
            expiresIn: "15d"
        } );

    res.cookie("token" , token);

    res.status(201).json({
        message : "account created successfully",
        user:{
            userId : user._id,
            username: user.username,
            email : user.email
        }
    });
}
 


async function loginController(req , res) {
    const {email , password} = req.body;

    const user = await userModel.findOne({email});

    if(!user){
        return res.status(402).json({message : "user not exist"});
    }

    const isPasswordValid = await bcrypt.compare(password , user.password);
    
    if(!isPasswordValid){
        return res.status(409).json({message : "password is inValid"})
    }
    const token = jwt.sign({
        userId : user._id
    }, config.JWT_KEY, 
        {
            expiresIn: "15d"
        } );
  
    res.cookie("token" , token);

    res.status(202).json({
        message: "user loggedIn successfully",
        user:{
            id: user._id,
            username : user.username,
            email : user.email
        }
    });

}



async function logoutController(req , res) {
    const token  = req.headers.cookie;

    
    if(token.length < 10){      //this will verify that user is logined aur not 
        return res.status(402).json({
            message: "user not logined",
            
        })
    }
    if(token){
        await tokenBlackListModel.create({token})
    }

    res.clearCookie("token")

    res.status(200).json({
        message : "Logout Successfull "
    });

}


async function getMe(req ,res) {

    const user  = await userModel.findById(req.user.userId);

    res.status(202).json({
        message : "user data is fetched ",
        user: {
            id : user._id,
            username : user.username,
            email : user.email
        }
    });
}

module.exports = {
    registerUserController,
    loginController,
    logoutController,
    getMe
}