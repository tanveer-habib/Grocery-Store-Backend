import express from "express";
import { userRegister, setUserAuth, userLogin, userLogout } from "../controllers/userController.js";
import isUserAuth from "../middlewares/isUserAuth.js";

const userRouter = express.Router();

userRouter.post("/register", userRegister);
userRouter.get("/isAuth", isUserAuth, setUserAuth);
userRouter.post("/login", userLogin);
userRouter.get("/logout", userLogout);

export default userRouter;