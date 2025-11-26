import { LoanRepository } from '../repositories/loanRepository';
import { Loan, calculateDueDate } from '@library-system/shared';
import { ApiClient } from '../utils/apiClient';

const CATALOG_SERVICE_URL = process.env.CATALOG_SERVICE_URL || 'http://localhost:3001';
const catalogApi = new ApiClient(CATALOG_SERVICE_URL, 'Circulation->Catalog');

export class LoanService {
  private loanRepository: LoanRepository;

  constructor() {
    this.loanRepository = new LoanRepository();
  }

  // Helper to convert mongoose LoanDocument -> shared Loan (string _id)
  private toLoan(doc: any): Loan {
    if (!doc) return doc;
    const obj = typeof doc.toObject === 'function' ? doc.toObject() : doc;
    if (obj._id && typeof obj._id !== 'string') {
      obj._id = obj._id.toString();
    }
    return obj as Loan;
  }

  async checkBookAvailability(bookId: string): Promise<boolean> {
    try {
      // Try the modern /api/items route first, then fall back to legacy /api/books
      const resp = await catalogApi.get(`/api/items/${bookId}`).catch(() => catalogApi.get(`/api/books/${bookId}`));
      const item = resp.data.data || resp.data;
      if (!item) {
        throw new Error('Book not found');
      }
      return item.availability === true;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Book not found');
      }
      console.error('Error checking book availability:', error.message || error);
      throw new Error('Failed to check book availability');
    }
  }

  async createLoan(itemId: string, memberId: string, days: number = 14): Promise<Loan> {
    // Check if item is available
    const isAvailable = await this.checkBookAvailability(itemId);
    if (!isAvailable) {
      throw new Error('Item is not available for borrowing');
    }

    // Check if there's already an active loan for this item
    const existingLoan = await this.loanRepository.findActiveLoanByBookId(itemId);
    if (existingLoan) {
      throw new Error('Item is already on loan');
    }

    const borrowDate = new Date();
    const dueDate = calculateDueDate(borrowDate, days);

    const loanData: Omit<Loan, '_id'> = {
      bookId: itemId, // Keep for backward compatibility
      memberId,
      borrowDate,
      dueDate,
      isOverdue: false,
      status: 'active'
    };

    const loanDoc = await this.loanRepository.create(loanData);

    // Update item availability in catalog service - Set to UNAVAILABLE when borrowed
    try {
      const itemResponse = await catalogApi.get(`/api/items/${itemId}`).catch(() =>
        catalogApi.get(`/api/books/${itemId}`)
      );
      const item = itemResponse.data.data || itemResponse.data;

      await catalogApi.put(`/api/items/${itemId}`, { availability: false }).catch(() =>
        catalogApi.put(`/api/books/${itemId}`, { availability: false })
      );
      console.log(`✅ Item "${item.title}" marked as UNAVAILABLE (on loan)`);
    } catch (error: any) {
      console.error('Error updating item availability:', error.message);
      // Rollback loan creation if item update fails
      await this.loanRepository.delete(loanDoc._id!.toString());
      throw new Error('Failed to update item availability. Loan cancelled.');
    }

    // Add borrowed item to member in catalog service
    try {
      const memberResponse = await catalogApi.get(`/api/members/${memberId}`);
      const member = memberResponse.data.data || memberResponse.data;
      const borrowedItems = member.borrowedItems || [];
      if (!borrowedItems.includes(itemId)) {
        borrowedItems.push(itemId);
        await catalogApi.put(`/api/members/${memberId}`, {
          borrowedItems: borrowedItems
        });
        console.log(`✅ Added item to member's borrowed items list`);
      }
    } catch (error: any) {
      console.error('Error updating member borrowed items:', error.message);
      // Note: We don't rollback here as the loan and item update are already done
    }

    return this.toLoan(loanDoc);
  }

  async getAllLoans(): Promise<Loan[]> {
    const docs = await this.loanRepository.findAll();
    return docs.map(d => this.toLoan(d));
  }

  async getLoanById(id: string): Promise<Loan | null> {
    const doc = await this.loanRepository.findById(id);
    return doc ? this.toLoan(doc) : null;
  }

  async getLoansByMemberId(memberId: string): Promise<Loan[]> {
    const docs = await this.loanRepository.findByMemberId(memberId);
    return docs.map(d => this.toLoan(d));
  }

  async getLoansByBookId(bookId: string): Promise<Loan[]> {
    const docs = await this.loanRepository.findByBookId(bookId);
    return docs.map(d => this.toLoan(d));
  }

  async getOverdueLoans(): Promise<Loan[]> {
    await this.loanRepository.updateOverdueStatus();
    const docs = await this.loanRepository.findOverdueLoans();
    return docs.map(d => this.toLoan(d));
  }

  async getActiveLoans(): Promise<Loan[]> {
    const docs = await this.loanRepository.findActiveLoans();
    return docs.map(d => this.toLoan(d));
  }
}

