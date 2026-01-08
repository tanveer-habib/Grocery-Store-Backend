import "dotenv/config"
import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import sellerRouter from "./routes/sellerRoute.js";
import productRouter from "./routes/productRoute.js"
import connectCloudinary from "./configs/cloudinary.js";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import { stripeWebhooks } from "./controllers/orderControllers.js";

const app = express();
const port = process.env.PORT || 3000;

// Connection of MongoDB and Cludinary
await connectDB()
await connectCloudinary();

// The following front-end can request.
const allowOrigins = ["http://localhost:5173", "http://192.168.43.106:5173"]

// Stripe webhooks url
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowOrigins, credentials: true }));

app.get("/", (req, res) => {
    res.send("Hey this is Home Page.");
});

app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter)


app.listen(port, "0.0.0.0", () => {
    console.log(`Server is listening on port http://localhost:${port}`)
});
