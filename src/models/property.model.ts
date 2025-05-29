import mongoose, { Document, Schema } from 'mongoose';

export interface IProperty extends Document {
  id: string;
  title: string;
  type: string;
  price: number;
  state: string;
  city: string;
  areaSqFt: number;
  bedrooms: number;
  bathrooms: number;
  amenities?: string;
  furnished?: string;
  availableFrom?: string;
  listedBy?: string;
  tags?: string;
  colorTheme?: string;
  rating?: number;
  isVerified?: boolean;
  listingType?: string;
  rent?: number;
  createdBy: mongoose.Types.ObjectId; // user who created the property
}

const propertySchema: Schema<IProperty> = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  areaSqFt: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  amenities: { type: String },
  furnished: { type: String },
  availableFrom: { type: String },
  listedBy: { type: String },
  tags: { type: String },
  colorTheme: { type: String },
  rating: { type: Number },
  isVerified: { type: Boolean },
  listingType: { type: String },
  rent: { type: Number },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // ownership: user who created this property
  },
}, {
  timestamps: true,
});

export default mongoose.model<IProperty>('Property', propertySchema);
