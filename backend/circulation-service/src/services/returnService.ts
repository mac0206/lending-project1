import { LoanRepository } from '../repositories/loanRepository';
import { Loan } from '@library-system/shared';
import { ApiClient } from '../utils/apiClient';

const CATALOG_SERVICE_URL = process.env.CATALOG_SERVICE_URL || 'http://localhost:3001';
const catalogApi = new ApiClient(CATALOG_SERVICE_URL, 'Circulation->Catalog');

export class ReturnService {
  private loanRepository: LoanRepository;

  constructor() {
    this.loanRepository = new LoanRepository();
  }

  async returnBook(loanId: string): Promise<Loan | null> {
    const loan = await this.loanRepository.findById(loanId);
    
    if (!loan) {
      throw new Error('Loan not found');
    }

    if (loan.status === 'returned') {
      throw new Error('Book has already been returned');
    }

    const returnDate = new Date();
    const updatedLoan = await this.loanRepository.update(loanId, {
      returnDate,
      status: 'returned',
      isOverdue: false
    });

    if (!updatedLoan) {
      throw new Error('Failed to update loan');
    }

    // Update item availability in catalog service - Set to AVAILABLE when returned
    try {
      const itemId = (updatedLoan as any).itemId || updatedLoan.bookId;
      const itemResponse = await catalogApi.get(`/api/items/${itemId}`).catch(() => 
        catalogApi.get(`/api/books/${itemId}`)
      );
      const item = itemResponse.data.data || itemResponse.data;
      
      await catalogApi.put(`/api/items/${itemId}`, { 
        availability: true 
      }).catch(() =>
        catalogApi.put(`/api/books/${itemId}`, { availability: true })
      );
      console.log(`✅ Item "${item.title}" marked as AVAILABLE (returned to library)`);
    } catch (error: any) {
      console.error('Error updating item availability:', error.message);
      throw new Error('Failed to update item availability');
    }

    // Remove borrowed item from member in catalog service
    try {
      const member = await catalogApi.get(`/api/members/${updatedLoan.memberId}`);
      const borrowedItems = member.data.borrowedItems || [];
      const updatedItems = borrowedItems.filter((id: string) => id !== updatedLoan.bookId);
      await catalogApi.put(`/api/members/${updatedLoan.memberId}`, {
        borrowedItems: updatedItems
      });
    } catch (error: any) {
      console.error('Error updating member borrowed items:', error.message);
      // Note: Book is already marked as available, so we continue
    }

    // Convert mongoose document to shared Loan shape (string _id)
    const result = typeof updatedLoan.toObject === 'function' ? updatedLoan.toObject() : updatedLoan;
    if (result._id && typeof result._id !== 'string') {
      result._id = result._id.toString();
    }
    return result as Loan;
  }

  async returnBookByBookId(bookId: string): Promise<Loan | null> {
    const activeLoan = await this.loanRepository.findActiveLoanByBookId(bookId);
    
    if (!activeLoan) {
      throw new Error('No active loan found for this book');
    }

    return await this.returnBook(activeLoan._id!.toString());
  }

  async updateOverdueItems(): Promise<number> {
    await this.loanRepository.updateOverdueStatus();
    const overdueLoans = await this.loanRepository.findOverdueLoans();
    return overdueLoans.length;
  }
}

