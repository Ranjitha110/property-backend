import express from "express";
import {
  addFavourite,
  removeFavourite,
  getUserFavourites,
} from "../controllers/favourite.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/add", authenticate, addFavourite);
router.delete("/remove", authenticate, removeFavourite);
router.get("/", authenticate, getUserFavourites);

export default router;
