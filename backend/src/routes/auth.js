require("dotenv").config();
const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const {
    validateSignUpData, validateLoginData
} = require("../utils/validation");

const validator = require("validator");
const { userAuth } = require("../middlewares/auth");

//to create account

authRouter.post("/signup", async (req, res) => {
    try {
        validateSignUpData(req);
        const { username, firstName, lastName, email, password } = req.body;

        const isEMailExist = await User.find({ email });
        if (isEMailExist.length > 0) {
            return res.status(400).json({
                success: false, error: "Email already exists try logging in"
            });
        }

        const isUsernameExist = await User.find({ username });
        if (isUsernameExist.length > 0) {
            return res.status(400).json({
                success: false, error: "Username already exists , try another username"
            });
        }

        //creating password hash and saving it to database

        const passwordHash = await bcrypt.hash(password, 10);
        const adminEmails = process.env.adminEmails ? process.env.adminEmails.split(",") : [];

        let user;

        if (adminEmails.includes(email)) {
            user = new User({
                username, firstName, lastName, email, password: passwordHash, role: "admin"
            });

        } else {
            user = new User({
                username, firstName, lastName, email, password: passwordHash
            });
        }

        await user.save();

        const token = user.getJWT();
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,        // REQUIRED for cross-site cookies
            sameSite: "lax",    // REQUIRED for cross-site cookies
        });

        await user.save();
        res.status(201)
            .json({ success: true, message: "Account Created successfully" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

//to login account

authRouter.post("/login", async (req, res) => {
    try {
        validateLoginData(req);
        const { username, email, password } = req.body;
        const userId = email || username;

        const user = await User.findOne({
            $or: [{ email: userId }, { username: userId }],
        });

        if (!user) {
            return res.status(400).json({
                success: false, error: "Account does not exist"
            });
        }

        //* checking if password is valid
        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {
            //* JWT token created at user model
            const token = user.getJWT();

            //* adding the token to cookie and send back to user
            res.cookie("token", token, {
                httpOnly: true,
                secure: false,      // ⚠️ use false in local dev
                sameSite: "lax",  // required for cross-origin
            });
            res
                .status(200)
                .json({ succuss: true, message: "Logged successfully", user });
        } else {
            res.status(400).json({ succuss: false, error: "Invalid Credential" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ succuss: false, error: err.message });
    }
});


//*TO logout user
authRouter.post("/logout", async (req, res) => {
    //expiring cookie to logout user
    res.cookie("token", "", {
        expires: new Date(0),
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
    });

    res.status(200).json({ success: true, message: "Logged Out Successfully" });
});


//TO Change password when not logged in
authRouter.patch("/forgotPassword", async (req, res) => {
    try {
        const { email, username } = req.body;
        const userId = email || username;
        const user = await User.findOne({
            $or: [{ emial: userId }, { username: userId }],
        });

        if (!user) {
            return res.status(400).json({ error: "invalid Crendential" });
        }

        //neet to add otp verfication of userid

        const { password } = req.body;
        //Adding password hash to user document
        if (validator.isStrongPassword(password)) {
            const passwordHash = await bcrypt.hash(password, 10);
            user.password = passwordHash;

            await user.save();
            res.status(200).json({ message: "Password Has Been changed" });
        } else {
            throw new Error("Password is not strong");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

//* To change password when login
authRouter.patch("/changePassword", userAuth, async (req, res) => {
    try {
        //* storing logged user data to loggedInUser
        const loggedInUser = req.user;
        if (!loggedInUser) {
            return res
                .status(401)
                .json({ error: "Unauthorized. Please login again." });
        }
        const { password, newPassword } = req.body;

        //* Adding password to user document
        if (validator.isStrongPassword(newPassword)) {
            const isPasswordValid = await loggedInUser.validatePassword(password);
            if (isPasswordValid) {
                const passwordHash = await bcrypt.hash(newPassword, 10);
                loggedInUser.password = passwordHash;
                await loggedInUser.save();
                res.status(200).json({ message: "Password Has Been changed" });
            } else {
                throw new Error("Password is incorrect");
            }
        } else {
            throw new Error("Password is not strong");
        }
    } catch (err) {

        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = authRouter;

