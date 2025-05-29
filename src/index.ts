import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import app from "./app";
import { connectRedis } from "./utils/redis";
import authRoutes from './routes/auth.routes';
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI!)
  .then(async () => {
    console.log("Connected to MongoDB");

    await connectRedis();

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection failed", err));
