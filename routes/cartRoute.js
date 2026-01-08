import express from "express";
import isUserAuth from "../middlewares/isUserAuth.js";
import { cartUpdate } from "../controllers/cartController.js";

const cartRouter = express.Router();

cartRouter.post("/update", isUserAuth, cartUpdate);

export default cartRouter;