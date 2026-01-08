import express from "express";
import { upload } from "../configs/multer.js";
import isSellerAuth from "../middlewares/isSellerAuth.js";
import { addProduct, productList, changeStock, destroyProduct } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/add", upload.array("images"), isSellerAuth, addProduct);
productRouter.get("/list", productList);
productRouter.post("/stock", isSellerAuth, changeStock)
productRouter.delete("/destroy", isSellerAuth, destroyProduct)

export default productRouter;