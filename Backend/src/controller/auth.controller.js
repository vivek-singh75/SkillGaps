const mongoose = require("mongoose")
const userModel = require('../models/userModel');
const tokenBlackListModel =  require("../models/blacklist.model");
const interviewReportModel = require("../models/interviewReport.model")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/config");
const crypto = require("crypto");
const { sendVerificationEmail } = require("../services/email.service");

/**
 * 
 * @name registerUserController
 * @api  /api/auth/register
 * @action this api is used to register new user 
 */

async function registerUserController(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Enter all details"
            });
        }

        const existingUser = await userModel.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {

            // User exists but has not verified email
            if (!existingUser.isVerified) {
                return res.status(403).json({
                    message: "Account already exists but email is not verified",
                    needsVerification: true,
                    email: existingUser.email
                });
            }

            // User exists and is already verified
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const hash = await bcrypt.hash(password, 10);

        // Generate verification token
        const verificationToken = crypto
            .randomBytes(32)
            .toString("hex");

        const user = await userModel.create({
            username,
            email,
            password: hash,

            isVerified: false,

            verificationToken,

            verificationTokenExpires:
                new Date(Date.now() + 15 * 60 * 1000),

            verificationExpiresAt:
                new Date(Date.now() + 24 * 60 * 60 * 1000),

            resendCount: 0,
            lastResendAt: null
        });

        // Send verification email
        await sendVerificationEmail(
            user.email,
            verificationToken
        );

        return res.status(201).json({
            message: "Account created. Please verify your email.",
            needsVerification: true,
            user: {
                userId: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {

        console.error("Register error:", error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}


async function resendEmailController(req, res) {

    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }


        const user = await userModel.findOne({
            email
        });


        if (!user) {
            return res.status(404).json({
                message: "Account not found"
            });
        }


        // =========================
        // ALREADY VERIFIED
        // =========================

        if (user.isVerified) {
            return res.status(400).json({
                message: "Email is already verified"
            });
        }


        // =========================
        // MAXIMUM 3 RESENDS
        // =========================

        if (user.resendCount >= 3) {

            return res.status(429).json({
                message:
                    "You have reached the maximum resend limit. Please try again later."
            });
        }


        // =========================
        // 1 MINUTE COOLDOWN
        // =========================

        if (user.lastResendAt) {

            const oneMinute =
                60 * 1000;

            const timePassed =
                Date.now() -
                user.lastResendAt.getTime();


            if (timePassed < oneMinute) {

                const remainingSeconds =
                    Math.ceil(
                        (oneMinute - timePassed) / 1000
                    );

                return res.status(429).json({
                    message:
                        `Please wait ${remainingSeconds} seconds before requesting another email.`,
                    remainingSeconds
                });
            }
        }


        // =========================
        // GENERATE NEW TOKEN
        // =========================

        const verificationToken =
            crypto.randomBytes(32).toString("hex");


        user.verificationToken =
            verificationToken;

        user.verificationTokenExpires =
            new Date(
                Date.now() + 15 * 60 * 1000
            );


        user.resendCount += 1;

        user.lastResendAt = new Date();


        await user.save();


        // =========================
        // SEND EMAIL
        // =========================

        await sendVerificationEmail(
            user.email,
            verificationToken
        );


        return res.status(200).json({

            message:
                "Verification email sent successfully.",

            remainingResends:
                3 - user.resendCount,

            cooldownSeconds: 60
        });


    } catch (error) {

        return res.status(429).json({
        message: `Please wait ${remainingSeconds} seconds before requesting another email.`,
        remainingSeconds,
        remainingResends: 3 - user.resendCount
    });
    }
}

async function verifyEmailController(req, res) {

    try {

        const { token } = req.query;

        if (!token) {
            return res.status(400).json({
                message: "Verification token is missing"
            });
        }

        const user = await userModel.findOne({
            verificationToken: token,
            verificationTokenExpires: {
                $gt: new Date()
            }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired verification link"
            });
        }

        // Verify user
        user.isVerified = true;

        // Remove verification data
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;

        // Cancel 24-hour auto deletion
        user.verificationExpiresAt = undefined;

        await user.save();

        return res.status(200).json({
            message: "Email verified successfully"
        });

    } catch (error) {

        console.error("Email verification error:", error);

        return res.status(500).json({
            message: "Email verification failed"
        });
    }
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
    resendEmailController,
    verifyEmailController,
    loginController,
    logoutController,
    getMe,
    deleteAccController,
    updateUserDetails,
    updateUserpassword
}