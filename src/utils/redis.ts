import { createClient } from 'redis';

const client = createClient();

client.on('error', (err) => console.error('Redis Client Error', err));

let isConnected = false;

export const connectRedis = async () => {
  if (isConnected) {
    console.log("Redis client already connected");
    return;
  }
  try {
    await client.connect();
    isConnected = true;
    console.log("Connected to Redis successfully!");
  } catch (error) {
    console.error("Redis connection failed:", error);
  }
};

export default client;
