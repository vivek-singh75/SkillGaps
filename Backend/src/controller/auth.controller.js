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

    res.cookie("token", token, {  //after deployment 
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 24 * 60 * 60 * 1000
    });

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
  
    //res.cookie("token" , token);
    res.cookie("token", token, {    //for deployment 
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 24 * 60 * 60 * 1000
    });

    res.status(202).json({
        message: "user loggedIn successfully",
        user:{
            id: user._id,
            username : user.username,
            email : user.email
        }
    });

}


async function logoutController(req, res) {
    try {

        const token = req.cookies?.token;

        // User is not logged in
        if (!token) {
            return res.status(401).json({
                message: "User is not logged in"
            });
        }

        // Add token to blacklist
        await tokenBlackListModel.create({
            token
        });

        // Clear cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/"
        });

        return res.status(200).json({
            message: "Logout successful"
        });

    } catch (error) {

        console.error("Logout error:", error);

        return res.status(500).json({
            message: "Logout failed"
        });
    }
}

async function getMe(req, res) {
    try {
        const token = req.cookies?.token;

        // No token = not logged in
        if (!token) {
            return res.status(200).json({
                user: null
            });
        }

        // Check blacklist
        const isBlacklisted = await tokenBlackListModel.findOne({
            token
        });

        if (isBlacklisted) {
            return res.status(200).json({
                user: null
            });
        }

        // Verify token
        const decoded = jwt.verify(token, config.JWT_KEY);

        // Find user
        const user = await userModel.findById(decoded.userId)
            .select("-password");

        if (!user) {
            return res.status(200).json({
                user: null
            });
        }

        return res.status(200).json({
            user
        });

    } catch (error) {

        // Expired / invalid token
        return res.status(200).json({
            user: null
        });
    }
}

module.exports = {
    registerUserController,
    loginController,
    logoutController,
    getMe
}