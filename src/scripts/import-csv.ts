import mongoose from "mongoose";
import fetch from "node-fetch";
import csv from "csv-parser";
import { config } from "dotenv";
import Property from "../models/property.model"; // adjust path

config();

const csvUrl = "https://cdn2.gro.care/db424fd9fb74_1748258398689.csv";

const importCsvToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "", {
      dbName: "property_db",
    });

    console.log("Connected to MongoDB");

    const response = await fetch(csvUrl);
    if (!response.ok || !response.body) throw new Error("Fetch failed");

    const properties: any[] = [];

    await new Promise<void>((resolve, reject) => {
      (response.body as NodeJS.ReadableStream)
        .pipe(csv())
        .on("data", (data) => {
          // Convert types here:
          properties.push({
            id: data.id,
            title: data.title,
            type: data.type,
            price: Number(data.price),
            state: data.state,
            city: data.city,
            areaSqFt: Number(data.areaSqFt),
            bedrooms: Number(data.bedrooms),
            bathrooms: Number(data.bathrooms),
            amenities: data.amenities,
            furnished: data.furnished,
            availableFrom: data.availableFrom, // keep as string or convert to Date if needed
            listedBy: data.listedBy,
            tags: data.tags,
            colorTheme: data.colorTheme,
            rating: Number(data.rating),
            isVerified: data.isVerified === "true",
            listingType: data.listingType,
            rent: Number(data.rent),
          });
        })
        .on("end", resolve)
        .on("error", reject);
    });

    await Property.insertMany(properties);
    console.log(`${properties.length} properties imported successfully.`);

    process.exit(0);
  } catch (error) {
    console.error("CSV import failed:", error);
    process.exit(1);
  }
};

importCsvToMongoDB();
