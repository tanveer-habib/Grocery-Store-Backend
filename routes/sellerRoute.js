import express from "express"
import { sellerLogin, setSellerAuth, sellerLogout } from "../controllers/sellerController.js";
import isSellerAuth from "../middlewares/isSellerAuth.js";

const sellerRouter = express.Router();

sellerRouter.post("/login", sellerLogin);
sellerRouter.get("/is-auth", isSellerAuth, setSellerAuth);
sellerRouter.get("/logout", isSellerAuth, sellerLogout);

export default sellerRouter;