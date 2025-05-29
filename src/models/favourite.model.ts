import { Schema, model, Document, Types } from 'mongoose';

export interface IFavourite extends Document {
  user: Types.ObjectId;       // Reference to User
  property: Types.ObjectId;   // Reference to Property
  createdAt: Date;
  updatedAt: Date;
}

const favouriteSchema = new Schema<IFavourite>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  },
  {
    timestamps: true,  // automatically adds createdAt and updatedAt
  }
);

// To ensure user can't favorite the same property multiple times,
// you could add a compound unique index:
favouriteSchema.index({ user: 1, property: 1 }, { unique: true });

export const Favourite = model<IFavourite>('Favourite', favouriteSchema);
