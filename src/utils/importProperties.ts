import fetch from "node-fetch";
import csv from "csv-parser";
import { Readable } from "stream";

const csvUrl = "https://cdn2.gro.care/db424fd9fb74_1748258398689.csv";

const readCsvFromUrl = async () => {
  const response = await fetch(csvUrl);

  if (!response.ok || !response.body) {
    throw new Error("Failed to fetch or empty response body");
  }

  const results: any[] = [];

  // 👇 Cast response.body to NodeJS.ReadableStream
  await new Promise<void>((resolve, reject) => {
    (response.body as NodeJS.ReadableStream)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", resolve)
      .on("error", reject);
  });

  console.log("Parsed CSV Data:", results);
};

readCsvFromUrl();
