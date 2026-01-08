import Address from "../models/Address.js";

// Add Address : /api/address/add
export const addAddress = async (req, res) => {
    try {
        const { userId, form } = req.body;
        await Address.create({ ...form, userId });
        return res.json({ success: true, message: "Address Added" });
    } catch (err) {
        return res.json({ success: false, message: err.message });
    };
};

// Get Addresses : /api/address/get
export const getAddress = async (req, res) => {
    try {
        const { userId } = req.body;
        const addresses = await Address.find({ userId });
        return res.json({ success: true, addresses });
    } catch (err) {
        return res.json({ success: false, message: err.message });
    };
};