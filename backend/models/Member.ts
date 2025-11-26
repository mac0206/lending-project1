import mongoose, { Schema, Document } from 'mongoose';
import { Member as IMember } from '@library-system/shared';

// Mongoose document for Member: use shared shape without _id so mongoose's ObjectId doesn't conflict
export interface MemberDocument extends Omit<IMember, '_id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const MemberSchema = new Schema<MemberDocument>({
  name: { type: String, required: true },
  studentId: { type: String, required: true, unique: true },
  borrowedItems: { type: [String], default: [] },
  email: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

MemberSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const MemberModel = mongoose.model<MemberDocument>('Member', MemberSchema);

