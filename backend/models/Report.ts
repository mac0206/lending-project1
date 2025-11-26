import mongoose, { Schema, Document } from 'mongoose';

export interface DashboardDocument extends Document {
  totalBooks: number;
  totalMembers: number;
  activeLoans: number;
  overdueLoans: number;
  availableBooks: number;
  lastUpdated: Date;
}

const DashboardSchema = new Schema<DashboardDocument>({
  totalBooks: { type: Number, default: 0 },
  totalMembers: { type: Number, default: 0 },
  activeLoans: { type: Number, default: 0 },
  overdueLoans: { type: Number, default: 0 },
  availableBooks: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

export const DashboardModel = mongoose.model<DashboardDocument>('Dashboard', DashboardSchema);

