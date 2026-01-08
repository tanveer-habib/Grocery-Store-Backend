import User from "../models/User.js";

export const cartUpdate = async (req, res) => {
    try {
        const { userId, cartItems } = req.body;

        await User.findByIdAndUpdate(userId, { cartItems });
        return res.json({ success: true, message: "Cart Updated" });
    } catch (err) {
        console.log(err.message);
        return res.json({ success: false, message: err.message });
    };
};