import { Item } from '@library-system/shared';
import mongoose, { Schema, Document } from 'mongoose';

export interface ItemDocument extends Omit<Item, '_id'>, Document {}

const ItemSchema = new Schema<ItemDocument>({
  title: { type: String, required: true, trim: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['book', 'magazine', 'journal', 'dvd', 'other'],
    default: 'book'
  },
  availability: { type: Boolean, default: true },
  owner: { type: String, required: true, trim: true },
  author: { type: String, trim: true },
  isbn: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Validation: owner is required
ItemSchema.pre('validate', function(next) {
  if (!this.owner || this.owner.trim() === '') {
    next(new Error('Item must have an owner'));
  } else {
    next();
  }
});

ItemSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const ItemModel = mongoose.model<ItemDocument>('Item', ItemSchema);

