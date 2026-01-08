import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";
import User from "../models/User.js";

// Add Product : /api/product/add
export const addProduct = async (req, res) => {
    try {
        const images = req.files;
        const productData = JSON.parse(req.body.productData);
        let imageProductId = [];

        const imagesUrlObj = await Promise.allSettled(
            images.map(async (image) => {
                const result = await cloudinary.uploader.upload(image.path, { resource_type: "image" });
                imageProductId.push(result.public_id);
                return result.secure_url;
            })
        );

        const imagesUrl = imagesUrlObj.filter((item) => item.status === "fulfilled").map((item) => item.value);
        await Product.create({ ...productData, image: imagesUrl, imagePId: imageProductId });
        return res.json({ success: true, message: "Product Added" });
    } catch (err) {
        console.log(err.message);
        return res.json({ success: false, message: err.message });
    };
};

// Get All Products : /api/product/list
export const productList = async (req, res) => {
    try {
        const products = await Product.find({});
        return res.json({ success: true, products });
    } catch (err) {
        console.log(err.message);
        return res.json({ success: false, message: err.message });
    };
};

// Change Product Stock : /api/product/stock
export const changeStock = async (req, res) => {
    try {
        const { id, inStock } = req.body;
        const product = await Product.findByIdAndUpdate(id, { inStock: !inStock }, { new: true });

        // If product is now OUT of stock → remove from all carts
        if (!product.inStock) {
            await User.updateMany({ [`cartItems.${id}`]: { $exists: true } }, { $unset: { [`cartItems.${id}`]: "" } });
        };

        return res.json({ success: true, message: "Stock Updated" });
    } catch (err) {
        console.log(err.message);
        return res.json({ success: false, message: err.message });
    };
};

// Destroy Product : /api/product/destroy
export const destroyProduct = async (req, res) => {
    try {
        const { id, imagePId } = req.body;
        await cloudinary.api.delete_resources(imagePId);
        await Product.findByIdAndDelete(id);
        await User.updateMany({ [`cartItems${id}`]: { $exists: true } }, { $unset: { [`cartItems${id}`]: "" } });
        return res.json({ success: true, message: "Successfully Deleted" });
    } catch (err) {
        console.log(err.message);
        return res.json({ success: false, message: err.message });
    };
};