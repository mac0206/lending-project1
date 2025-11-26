import { DashboardModel } from '../../../models/Report';
import { ApiClient } from '../utils/apiClient';

const CATALOG_SERVICE_URL = process.env.CATALOG_SERVICE_URL || 'http://localhost:3001';
const CIRCULATION_SERVICE_URL = process.env.CIRCULATION_SERVICE_URL || 'http://localhost:3002';

const catalogApi = new ApiClient(CATALOG_SERVICE_URL, 'Reporting->Catalog');
const circulationApi = new ApiClient(CIRCULATION_SERVICE_URL, 'Reporting->Circulation');

export interface DashboardStats {
  totalBooks: number;
  totalMembers: number;
  activeLoans: number;
  overdueLoans: number;
  availableBooks: number;
  lastUpdated: Date;
}

export class DashboardService {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Fetch data from catalog service
      const [booksResponse, membersResponse] = await Promise.all([
        catalogApi.get('/api/books'),
        catalogApi.get('/api/members')
      ]);

      // Handle new response format: { success: true, data: [...] }
      const books = booksResponse.data.data || booksResponse.data;
      const members = membersResponse.data.data || membersResponse.data;

      // Ensure books and members are arrays
      const booksArray = Array.isArray(books) ? books : [];
      const membersArray = Array.isArray(members) ? members : [];

      // Fetch data from circulation service
      const [activeLoansResponse, overdueLoansResponse] = await Promise.all([
        circulationApi.get('/api/loans/active'),
        circulationApi.get('/api/loans/overdue')
      ]);

      // Handle new response format
      const activeLoans = activeLoansResponse.data.data || activeLoansResponse.data;
      const overdueLoans = overdueLoansResponse.data.data || overdueLoansResponse.data;
      
      // Ensure loans are arrays
      const activeLoansArray = Array.isArray(activeLoans) ? activeLoans : [];
      const overdueLoansArray = Array.isArray(overdueLoans) ? overdueLoans : [];
      
      const availableBooks = booksArray.filter((book: any) => book.availability === true);

      const stats: DashboardStats = {
        totalBooks: booksArray.length,
        totalMembers: membersArray.length,
        activeLoans: activeLoansArray.length,
        overdueLoans: overdueLoansArray.length,
        availableBooks: availableBooks.length,
        lastUpdated: new Date()
      };

      // Optionally save to Dashboard collection
      await this.saveDashboardStats(stats);

      return stats;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw new Error('Failed to fetch dashboard statistics');
    }
  }

  async saveDashboardStats(stats: DashboardStats): Promise<void> {
    try {
      await DashboardModel.findOneAndUpdate(
        {},
        {
          ...stats,
          lastUpdated: new Date()
        },
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error('Error saving dashboard stats:', error);
    }
  }

  async getStoredDashboardStats(): Promise<DashboardStats | null> {
    try {
      const dashboard = await DashboardModel.findOne().sort({ lastUpdated: -1 });
      if (!dashboard) {
        return null;
      }
      return {
        totalBooks: dashboard.totalBooks,
        totalMembers: dashboard.totalMembers,
        activeLoans: dashboard.activeLoans,
        overdueLoans: dashboard.overdueLoans,
        availableBooks: dashboard.availableBooks,
        lastUpdated: dashboard.lastUpdated
      };
    } catch (error) {
      console.error('Error fetching stored dashboard stats:', error);
      return null;
    }
  }
}

