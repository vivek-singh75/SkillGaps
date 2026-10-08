const mongoose = require("mongoose")
const userModel = require('../models/userModel');
const tokenBlackListModel =  require("../models/blacklist.model");
const interviewReportModel = require("../models/interviewReport.model")
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
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
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

        if (!token) {
            return res.status(401).json({
                message: "User is not logged in"
            });
        }

        await tokenBlackListModel.create({
            token
        });

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


async function updateUserDetails(req, res) {
  try {
    const userId = req.user.userId;

    const { username, email } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Email change ho raha hai
    if (email && email !== user.email) {

      const existingUser = await userModel.findOne({
        email: email.toLowerCase(),
        _id: { $ne: userId },
      });

      if (existingUser) {
        return res.status(409).json({
          message: "Email is already registered with another account",
        });
      }
    }

    user.username = username ?? user.username;
    user.email = email
      ? email.toLowerCase()
      : user.email;

    await user.save();

    return res.status(200).json({
        success : true,
      message: "User details updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Update user error:", error);

    return res.status(500).json({
      message: "Failed to update user details",
      success: false
    });
  }
};


async function updateUserpassword(req , res) {
    const user = req.user;

    const {newPassword ,currentPassword ,confirmPassword} = req.body;

    
    if(!user){
        return res.status(500).json({
            message : "user details not availble"
        });
    }

    if(newPassword !==confirmPassword){
        return res.status(403).json({
            message : "newPassword and confirmPassword are not same"
        });
    }

    const userDetails =await userModel.findById(user.userId);

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword , userDetails.password);
    
    if(!isCurrentPasswordValid){
        return res.status(409).json({message : "password is inValid"});
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const passwordUpdated = await userModel.findByIdAndUpdate(user.userId,
        {
            password : hashedPassword  
        }
    );

    
    return res.status(206).json({
        message : "password changed successfully",
    })

}


async function deleteAccController(req, res) {

    try {
        const user = req.user.userId;
        const { password } = req.body;

        if (!user) {
            return res.status(404).json({
                message: "User not available"
            });
        }

        if (!password) {
            return res.status(400).json({
                message: "Please enter your password"
            });
        }

        const userDetails = await userModel.findById(user);

        if (!userDetails) {
            return res.status(404).json({
                message: "User details not found"
            });
        }

        const isCurrentPasswordValid = await bcrypt.compare(
            password,
            userDetails.password
        );

        if (!isCurrentPasswordValid) {
            return res.status(401).json({
                message: "Password is invalid or incorrect"
            });
        }

        /*=====================================
          MongoDB Transaction
        =====================================*/

        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            // Delete all interview reports
            await interviewReportModel.deleteMany(
                { user: user },
                { session }
            );

            // Delete user
            await userModel.findByIdAndDelete(
                user,
                { session }
            );

            // Commit transaction
            await session.commitTransaction();

        } catch (error) {

            // Rollback everything
            await session.abortTransaction();

            // Send error to outer catch
            throw error;

        } finally {
            session.endSession();
        }

        return res.status(200).json({
            success: true,
            message: "Account deleted successfully"
        });

    } catch (error) {

        console.error("Account deletion failed:", error);

        return res.status(500).json({
            success: false,
            message: "Account deletion failed"
        });
    }
}








module.exports = {
    registerUserController,
    loginController,
    logoutController,
    getMe,
    deleteAccController,
    updateUserDetails,
    updateUserpassword
}