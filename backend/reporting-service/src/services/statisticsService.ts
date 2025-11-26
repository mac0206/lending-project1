import { Loan } from '@library-system/shared';
import { ApiClient } from '../utils/apiClient';

const CIRCULATION_SERVICE_URL = process.env.CIRCULATION_SERVICE_URL || 'http://localhost:3002';
const CATALOG_SERVICE_URL = process.env.CATALOG_SERVICE_URL || 'http://localhost:3001';

const circulationApi = new ApiClient(CIRCULATION_SERVICE_URL, 'Reporting->Circulation');
const catalogApi = new ApiClient(CATALOG_SERVICE_URL, 'Reporting->Catalog');

export interface BookBorrowingStats {
  bookId: string;
  title: string;
  author: string;
  borrowCount: number;
}

export interface MemberBorrowingStats {
  memberId: string;
  name: string;
  studentId: string;
  borrowCount: number;
}

export interface BorrowingHistory {
  loan: Loan;
  bookTitle?: string;
  memberName?: string;
}

export class StatisticsService {
  async getMostBorrowedBooks(limit: number = 10): Promise<BookBorrowingStats[]> {
    try {
      const loansResponse = await circulationApi.get('/api/loans');
      // Handle new response format
      const loans: Loan[] = loansResponse.data.data || loansResponse.data;
      const loansArray = Array.isArray(loans) ? loans : [];

      // Count borrows per book
      const bookCounts: { [key: string]: number } = {};
      loansArray.forEach(loan => {
        const itemId = (loan as any).itemId || loan.bookId;
        bookCounts[itemId] = (bookCounts[itemId] || 0) + 1;
      });

      // Get book details
      const bookIds = Object.keys(bookCounts);
      const bookPromises = bookIds.map(bookId =>
        catalogApi.get(`/api/books/${bookId}`).catch(() => null)
      );
      const bookResponses = await Promise.all(bookPromises);

      // Combine data
      const stats: BookBorrowingStats[] = bookIds
        .map((bookId, index) => {
          const bookResponse = bookResponses[index];
          const book = bookResponse?.data?.data || bookResponse?.data;
          return {
            bookId,
            title: book?.title || 'Unknown',
            author: book?.author || 'Unknown',
            borrowCount: bookCounts[bookId]
          };
        })
        .sort((a, b) => b.borrowCount - a.borrowCount)
        .slice(0, limit);

      return stats;
    } catch (error) {
      console.error('Error fetching most borrowed books:', error);
      throw new Error('Failed to fetch most borrowed books statistics');
    }
  }

  async getBorrowingHistory(memberId?: string, bookId?: string): Promise<BorrowingHistory[]> {
    try {
      let url = '/api/loans';
      if (memberId) {
        url = `/api/loans/member/${memberId}`;
      } else if (bookId) {
        url = `/api/loans/book/${bookId}`;
      }

      const loansResponse = await circulationApi.get(url);
      // Handle new response format
      const loans: Loan[] = loansResponse.data.data || loansResponse.data;
      const loansArray = Array.isArray(loans) ? loans : [];

      // Fetch book and member details
      const historyPromises = loansArray.map(async (loan) => {
        try {
          const itemId = (loan as any).itemId || loan.bookId;
          const memberIdValue = loan.memberId || (loan as any).borrowerMemberId;
          const [bookResponse, memberResponse] = await Promise.all([
            catalogApi.get(`/api/books/${itemId}`).catch(() => null),
            catalogApi.get(`/api/members/${memberIdValue}`).catch(() => null)
          ]);

          const book = bookResponse?.data?.data || bookResponse?.data;
          const member = memberResponse?.data?.data || memberResponse?.data;
          return {
            loan,
            bookTitle: book?.title || 'Unknown',
            memberName: member?.name || 'Unknown'
          };
        } catch (error) {
          return {
            loan,
            bookTitle: 'Unknown',
            memberName: 'Unknown'
          };
        }
      });

      const history = await Promise.all(historyPromises);
      return history.sort((a, b) => 
        new Date(b.loan.borrowDate).getTime() - new Date(a.loan.borrowDate).getTime()
      );
    } catch (error) {
      console.error('Error fetching borrowing history:', error);
      throw new Error('Failed to fetch borrowing history');
    }
  }

  async getOverdueBooks(): Promise<BorrowingHistory[]> {
    try {
      const overdueResponse = await circulationApi.get('/api/loans/overdue');
      // Handle new response format
      const overdueLoans: Loan[] = overdueResponse.data.data || overdueResponse.data;
      const overdueLoansArray = Array.isArray(overdueLoans) ? overdueLoans : [];

      const historyPromises = overdueLoansArray.map(async (loan) => {
        try {
          const itemId = (loan as any).itemId || loan.bookId;
          const memberIdValue = loan.memberId || (loan as any).borrowerMemberId;
          const [bookResponse, memberResponse] = await Promise.all([
            catalogApi.get(`/api/books/${itemId}`).catch(() => null),
            catalogApi.get(`/api/members/${memberIdValue}`).catch(() => null)
          ]);

          const book = bookResponse?.data?.data || bookResponse?.data;
          const member = memberResponse?.data?.data || memberResponse?.data;
          return {
            loan,
            bookTitle: book?.title || 'Unknown',
            memberName: member?.name || 'Unknown'
          };
        } catch (error) {
          return {
            loan,
            bookTitle: 'Unknown',
            memberName: 'Unknown'
          };
        }
      });

      return await Promise.all(historyPromises);
    } catch (error) {
      console.error('Error fetching overdue books:', error);
      throw new Error('Failed to fetch overdue books');
    }
  }

  async getMemberBorrowingStats(limit: number = 10): Promise<MemberBorrowingStats[]> {
    try {
      const loansResponse = await circulationApi.get('/api/loans');
      // Handle new response format
      const loans: Loan[] = loansResponse.data.data || loansResponse.data;
      const loansArray = Array.isArray(loans) ? loans : [];

      // Count borrows per member
      const memberCounts: { [key: string]: number } = {};
      loansArray.forEach(loan => {
        const memberId = loan.memberId || (loan as any).borrowerMemberId;
        memberCounts[memberId] = (memberCounts[memberId] || 0) + 1;
      });

      // Get member details
      const memberIds = Object.keys(memberCounts);
      const memberPromises = memberIds.map(memberId =>
        catalogApi.get(`/api/members/${memberId}`).catch(() => null)
      );
      const memberResponses = await Promise.all(memberPromises);

      // Combine data
      const stats: MemberBorrowingStats[] = memberIds
        .map((memberId, index) => {
          const memberResponse = memberResponses[index];
          const member = memberResponse?.data?.data || memberResponse?.data;
          return {
            memberId,
            name: member?.name || 'Unknown',
            studentId: member?.studentId || 'Unknown',
            borrowCount: memberCounts[memberId]
          };
        })
        .sort((a, b) => b.borrowCount - a.borrowCount)
        .slice(0, limit);

      return stats;
    } catch (error) {
      console.error('Error fetching member borrowing stats:', error);
      throw new Error('Failed to fetch member borrowing statistics');
    }
  }
}

