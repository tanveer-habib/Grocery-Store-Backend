import jwt from "jsonwebtoken";

export const sellerLogin = (req, res) => {
    try {
        const { email, password } = req.body.form;
        if (email === process.env.SELLER_EMAIL && password === process.env.SELLER_PASSWORD) {
            const sellerToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });
            res.cookie("sellerToken", sellerToken, { httpOnly: true, secure: process.env.IS_DEVELOPMENT === "production", sameSite: process.env.IS_DEVELOPMENT === "production" ? "none" : "strict", maxAge: 7 * 24 * 60 * 60 * 1000 })
            return res.json({ success: true, message: "Loged In" });
        } else {
            return res.json({ success: false, message: "Invalid Credentials" })
        }
    } catch (err) {
        console.log(err.message);
        return res.json({ success: false, message: err.message });
    }
};

export const setSellerAuth = (req, res) => {
    try {
        return res.json({ success: true })
    } catch (err) {
        console.log(err.message);
        return res.json({ success: false, message: err.message });
    };
};

export const sellerLogout = (req, res) => {
    try {
        res.clearCookie("sellerToken", {
            httpOnly: true,
            secure: process.env.IS_DEVELOPMENT === "production",
            sameSite: process.env.IS_DEVELOPMENT === "production" ? "none" : "strict"
        });
        return res.json({ success: true, message: "Logged Out" });
    } catch (err) {
        console.log(err.message);
        return res.json({ success: false, message: err.message });
    };
};