import mongoose from "mongoose"

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("MongoDB Connected");
        });
        await mongoose.connect(process.env.IS_DEVELOPMENT ? process.env.MONGODB_STANDARD_URI : process.env.MONGODB_SRV_URI);
    } catch (err) {
        console.log(err.message);
    };
};

export default connectDB;