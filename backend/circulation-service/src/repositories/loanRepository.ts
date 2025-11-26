import { LoanModel, LoanDocument } from '../../../models/Loan';
import { Loan } from '@library-system/shared';

export class LoanRepository {
  async create(loanData: Omit<Loan, '_id'>): Promise<LoanDocument> {
    const loan = new LoanModel(loanData);
    return await loan.save();
  }

  async findAll(): Promise<LoanDocument[]> {
    return await LoanModel.find();
  }

  async findById(id: string): Promise<LoanDocument | null> {
    return await LoanModel.findById(id);
  }

  async findByBookId(bookId: string): Promise<LoanDocument[]> {
    return await LoanModel.find({ bookId });
  }

  async findByMemberId(memberId: string): Promise<LoanDocument[]> {
    return await LoanModel.find({ memberId });
  }

  async findActiveLoanByBookId(bookId: string): Promise<LoanDocument | null> {
    return await LoanModel.findOne({ bookId, status: 'active' });
  }

  async findOverdueLoans(): Promise<LoanDocument[]> {
    return await LoanModel.find({ status: 'overdue' });
  }

  async findActiveLoans(): Promise<LoanDocument[]> {
    return await LoanModel.find({ status: 'active' });
  }

  async update(id: string, loanData: Partial<Loan>): Promise<LoanDocument | null> {
    return await LoanModel.findByIdAndUpdate(id, loanData, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await LoanModel.findByIdAndDelete(id);
    return !!result;
  }

  async updateOverdueStatus(): Promise<void> {
    const now = new Date();
    await LoanModel.updateMany(
      { status: 'active', dueDate: { $lt: now }, returnDate: null },
      { $set: { isOverdue: true, status: 'overdue' } }
    );
  }
}

