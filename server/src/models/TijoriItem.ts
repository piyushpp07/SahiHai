import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

export interface ITijoriItem extends Document {
  productName: string;
  purchaseDate: Date;
  expiryDate: Date;
  document?: string; // URL to the uploaded bill/warranty file
  user: IUser['_id'];
  createdAt: Date;
  updatedAt: Date;
}

const TijoriItemSchema = new Schema<ITijoriItem>(
  {
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    purchaseDate: {
      type: Date,
      required: [true, 'Purchase date is required'],
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    document: {
      type: String,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups by user and expiry date
TijoriItemSchema.index({ user: 1, expiryDate: 1 });

export default mongoose.model<ITijoriItem>('TijoriItem', TijoriItemSchema);
