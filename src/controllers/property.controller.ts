import { Request, Response } from 'express';
import Property from '../models/property.model';
import client from '../utils/redis';

// Get all properties with advanced filtering, pagination, sorting + Redis caching
export const getProperties = async (req: Request, res: Response) => {
  try {
    // Extract filters from query params
    const {
      page = '1',
      limit = '10',
      sortBy = 'createdAt',
      order = 'desc',
      ...filters
    } = req.query;

    // Build filter query object
    const filterQuery: any = {};

    // Convert filter values to proper types
    for (const key in filters) {
      const value = filters[key];
      if (typeof value === 'string') {
        // Handle numeric filters for specific fields
        if (['price', 'areaSqFt', 'bedrooms', 'bathrooms', 'rating', 'rent'].includes(key)) {
          filterQuery[key] = Number(value);
        } else if (key === 'isVerified') {
          filterQuery[key] = value === 'true';
        } else {
          filterQuery[key] = { $regex: value, $options: 'i' }; // case-insensitive partial match for strings
        }
      }
    }

    // Pagination
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Cache key based on query params for caching
    const cacheKey = `properties:${JSON.stringify(req.query)}`;

    // Try to get from Redis cache
    const cachedData = await client.get(cacheKey);
    if (cachedData) {
      console.log('Cache hit for getProperties');
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Query MongoDB
    const properties = await Property.find(filterQuery)
      .sort({ [sortBy as string]: order === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(limitNumber);

    // Cache the result for 10 minutes (600 seconds)
    await client.setEx(cacheKey, 600, JSON.stringify(properties));

    return res.status(200).json(properties);
  } catch (error) {
    console.error('getProperties error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get single property by ID with Redis caching
export const getPropertyById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const cacheKey = `property:${id}`;

  try {
    const cachedData = await client.get(cacheKey);
    if (cachedData) {
      console.log('Cache hit for getPropertyById', id);
      return res.status(200).json(JSON.parse(cachedData));
    }

    const property = await Property.findById(id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    await client.setEx(cacheKey, 600, JSON.stringify(property));

    return res.status(200).json(property);
  } catch (error) {
    console.error('getPropertyById error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Create a new property
export const createProperty = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const newProperty = new Property({
      ...req.body,
      createdBy: userId,
    });

    const savedProperty = await newProperty.save();
    await client.del('properties:all');

    return res.status(201).json(savedProperty);
  } catch (error) {
    console.error('createProperty error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update property (only by owner)
export const updateProperty = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const property = await Property.findById(id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (property.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Forbidden: Not your property' });
    }

    const updatedProperty = await Property.findByIdAndUpdate(id, req.body, { new: true });
    await client.del(`property:${id}`);
    await client.del('properties:all');

    return res.status(200).json(updatedProperty);
  } catch (error) {
    console.error('updateProperty error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete property (only by owner)
export const deleteProperty = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const property = await Property.findById(id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (property.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Forbidden: Not your property' });
    }

    await property.deleteOne();
    await client.del(`property:${id}`);
    await client.del('properties:all');

    return res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('deleteProperty error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
