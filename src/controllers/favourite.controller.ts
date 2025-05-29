import { RequestHandler } from "express";
import { Favourite } from "../models/favourite.model";
import Property from "../models/property.model";

// Add a property to favourites
export const addFavourite: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { userId, propertyId } = req.body;
    const existing = await Favourite.findOne({ user: userId, property: propertyId });

    if (existing) {
      res.status(400).json({ message: "Property already in favourites" });
      return;
    }

    const favourite = await Favourite.create({ user: userId, property: propertyId });
    res.status(201).json(favourite);
  } catch (err) {
    res.status(500).json({ error: "Failed to add to favourites", details: err });
  }
};

// Remove a property from favourites
export const removeFavourite: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { userId, propertyId } = req.body;

    const deleted = await Favourite.findOneAndDelete({ user: userId, property: propertyId });

    if (!deleted) {
      res.status(404).json({ message: "Favourite not found" });
    } else {
      res.status(200).json({ message: "Removed from favourites" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to remove from favourites", details: err });
  }
};

// ✅ Get all favourite properties for a user
export const getUserFavourites: RequestHandler = async (req, res): Promise<void> => {
  try {
    const userId = req.userId;

    const favourites = await Favourite.find({ user: userId }).populate("property");

    const properties = favourites.map((fav) => fav.property);

    res.status(200).json({ favourites: properties });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch favourites", details: err });
  }
};
