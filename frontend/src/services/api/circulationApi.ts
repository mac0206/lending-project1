import axios from 'axios';
import { Loan } from '@library-system/shared';

const API_BASE_URL = import.meta.env.VITE_CIRCULATION_API_URL ?? '/api/circulation';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const circulationApi = {
  // Loans
  getLoans: async (): Promise<Loan[]> => {
    const response = await api.get('/loans');
    return response.data.data || response.data;
  },

  getLoan: async (id: string): Promise<Loan> => {
    const response = await api.get(`/loans/${id}`);
    return response.data.data || response.data;
  },

  getActiveLoans: async (): Promise<Loan[]> => {
    const response = await api.get('/loans/active');
    return response.data.data || response.data;
  },

  getOverdueLoans: async (): Promise<Loan[]> => {
    const response = await api.get('/loans/overdue');
    return response.data.data || response.data;
  },

  getLoansByMember: async (memberId: string): Promise<Loan[]> => {
    const response = await api.get(`/loans/member/${memberId}`);
    return response.data.data || response.data;
  },

  getLoansByItem: async (itemId: string): Promise<Loan[]> => {
    const response = await api.get(`/loans/item/${itemId}`);
    return response.data.data || response.data;
  },

  getLoansByBook: async (bookId: string): Promise<Loan[]> => {
    const response = await api.get(`/loans/book/${bookId}`);
    return response.data.data || response.data;
  },

  // Member B requirements
  borrowItem: async (itemId: string, borrowerMemberId: string, days?: number): Promise<Loan> => {
    const response = await api.post('/loans/borrow', { itemId, borrowerMemberId, days });
    return response.data.data || response.data;
  },

  returnItem: async (itemId: string): Promise<Loan> => {
    const response = await api.post('/loans/return', { itemId });
    return response.data.data || response.data;
  },

  // Legacy methods (for backward compatibility)
  createLoan: async (bookId: string, memberId: string, days?: number): Promise<Loan> => {
    const response = await api.post('/loans', { bookId, memberId, days });
    return response.data.data || response.data;
  },

  checkAvailability: async (bookId: string): Promise<{ available: boolean }> => {
    const response = await api.get(`/books/${bookId}/availability`);
    return response.data;
  },

  // Returns
  returnBook: async (loanId: string): Promise<Loan> => {
    const response = await api.post(`/returns/loan/${loanId}`);
    return response.data;
  },

  returnBookByBookId: async (bookId: string): Promise<Loan> => {
    const response = await api.post(`/returns/book/${bookId}`);
    return response.data;
  },

  updateOverdueItems: async (): Promise<{ updated: number; message: string }> => {
    const response = await api.post('/returns/update-overdue');
    return response.data;
  }
};

