import User from "../models/User.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// User Registration : /api/user/register
export const userRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body.form;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Detail" });
        }

        const usernameExist = await User.findOne({ name });
        if (usernameExist) {
            return res.json({ success: false, message: "Username already taken! Try new username" })
        };

        const emailExist = await User.findOne({ email });
        if (emailExist) {
            return res.json({ success: false, message: "Email already taken! Try new email" })
        };

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });

        const userToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("userToken", userToken, { httpOnly: true, secure: process.env.IS_DEVELOPMENT === "production", sameSite: process.env.IS_DEVELOPMENT === "production" ? "none" : "strict", maxAge: 1000 * 60 * 60 * 24 * 7 });

        return res.json({ success: true, message: "User Registered" });
    } catch (err) {
        return res.json({ seccess: false, message: err.message });
    };
};

// isAuth : /api/user/isAuth
export const setUserAuth = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.json({ success: false, message: "No User found" });
        }
        return res.json({ success: true, user })
    } catch (err) {
        return res.json({ success: false, message: err.message });
    };
};

// User Login : /api/user/login
export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body.form;

        if (!email || !password) {
            return res.json({ success: false, message: "Missing Detail" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Not found any user" });
        };

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Credential" });
        };

        const userToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("userToken", userToken, { httpOnly: true, secure: process.env.Is_DEVELOPMENT === "production", sameSite: process.env.IS_DEVELOPMENT === "production" ? "none" : "strict", maxAge: 1000 * 60 * 60 * 24 * 7 });

        return res.json({ success: true, user: { email: user.email, name: user.name } });
    } catch (err) {
        return res.json({ success: false, message: err.message });
    };
};

export const userLogout = async (req, res) => {
    try {
        res.clearCookie("userToken", { httpOnly: true, secure: process.env.IS_DEVELOPMENT === "production", sameSite: process.env.IS_DEVELOPMENT === "production" ? "none" : "strict" });
        return res.json({ success: true, message: "Logged Out" });
    } catch (err) {
        console.log(err.message);
        return res.json({ success: false, message: err.message });
    };
};