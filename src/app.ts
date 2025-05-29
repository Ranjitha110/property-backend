import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import propertyRoutes from "./routes/property.routes";
import favouriteRoutes from "./routes/favourite.routes";
import { connectRedis } from "./utils/redis";

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to Property Listing Backend API');
});

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/favourites", favouriteRoutes);

// Wrap Redis connection and server start in async function if you start server here
const startServer = async () => {
  await connectRedis(); // wait for Redis connection before accepting requests

  // If you start the server here, e.g.:
  // const PORT = process.env.PORT || 5000;
  // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();

export default app;
