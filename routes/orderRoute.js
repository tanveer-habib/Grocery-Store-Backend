import express from "express";
import { placeOrderCOD, placeOrderStripe, getUserOrders, getSellerOrders } from "../controllers/orderControllers.js";
import isUserAuth from "../middlewares/isUserAuth.js";
import isSellerAuth from "../middlewares/isSellerAuth.js";

const orderRouter = express.Router();

orderRouter.post("/cod", isUserAuth, placeOrderCOD);
orderRouter.post("/stripe", isUserAuth, placeOrderStripe);
orderRouter.get("/user", isUserAuth, getUserOrders);
orderRouter.get("/seller", isSellerAuth, getSellerOrders);

export default orderRouter;