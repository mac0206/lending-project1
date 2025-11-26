import mongoose, { Schema, Document } from 'mongoose';
import { Loan as ILoan } from '@library-system/shared';

// Avoid conflicting _id types between shared Loan (_id?: string) and mongoose Document (_id: ObjectId)
export interface LoanDocument extends Omit<ILoan, '_id'>, Document {}

const LoanSchema = new Schema<LoanDocument>({
  bookId: { type: String, required: true },
  memberId: { type: String, required: true },
  borrowDate: { type: Date, required: true, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date },
  isOverdue: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'returned', 'overdue'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

LoanSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (this.status === 'active' && !this.returnDate) {
    this.isOverdue = new Date() > this.dueDate;
    if (this.isOverdue) {
      this.status = 'overdue';
    }
  }
  next();
});

export const LoanModel = mongoose.model<LoanDocument>('Loan', LoanSchema);

