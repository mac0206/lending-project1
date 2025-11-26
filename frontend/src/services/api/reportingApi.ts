import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_REPORTING_API_URL ?? '/api/reporting';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export interface DashboardStats {
  totalBooks: number;
  totalMembers: number;
  activeLoans: number;
  overdueLoans: number;
  availableBooks: number;
  lastUpdated: Date;
}

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
  loan: any;
  bookTitle?: string;
  memberName?: string;
}

export const reportingApi = {
  // Member C requirements
  getOverdueItems: async (): Promise<BorrowingHistory[]> => {
    const response = await api.get('/dashboard/overdue');
    return response.data.data || response.data;
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/stats');
    return response.data.data || response.data;
  },

  getLoanHistory: async (memberId?: string, itemId?: string, startDate?: string, endDate?: string): Promise<BorrowingHistory[]> => {
    const params = new URLSearchParams();
    if (memberId) params.append('memberId', memberId);
    if (itemId) params.append('itemId', itemId);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const response = await api.get(`/loans/history?${params.toString()}`);
    return response.data.data || response.data;
  },

  // Legacy methods
  getDashboard: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard');
    return response.data.data || response.data;
  },

  getStoredDashboard: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/stored');
    return response.data.data || response.data;
  },

  getMostBorrowedBooks: async (limit: number = 10): Promise<BookBorrowingStats[]> => {
    const response = await api.get(`/statistics/most-borrowed?limit=${limit}`);
    return response.data.data || response.data;
  },

  getBorrowingHistory: async (memberId?: string, bookId?: string): Promise<BorrowingHistory[]> => {
    const params = new URLSearchParams();
    if (memberId) params.append('memberId', memberId);
    if (bookId) params.append('bookId', bookId);
    const response = await api.get(`/statistics/borrowing-history?${params.toString()}`);
    return response.data.data || response.data;
  },

  getOverdueBooks: async (): Promise<BorrowingHistory[]> => {
    const response = await api.get('/statistics/overdue');
    return response.data.data || response.data;
  },

  getMemberBorrowingStats: async (limit: number = 10): Promise<MemberBorrowingStats[]> => {
    const response = await api.get(`/statistics/member-stats?limit=${limit}`);
    return response.data;
  }
};

