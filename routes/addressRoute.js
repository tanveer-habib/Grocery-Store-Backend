import express from "express";
import { addAddress, getAddress } from "../controllers/addressController.js";
import isUserAuth from "../middlewares/isUserAuth.js";

const addressRouter = express.Router();

addressRouter.post("/add", isUserAuth, addAddress);
addressRouter.get("/get", isUserAuth, getAddress);

export default addressRouter;