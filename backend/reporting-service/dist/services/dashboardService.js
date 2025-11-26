"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const Report_1 = require("../../../models/Report");
const apiClient_1 = require("../utils/apiClient");
const CATALOG_SERVICE_URL = process.env.CATALOG_SERVICE_URL || 'http://localhost:3001';
const CIRCULATION_SERVICE_URL = process.env.CIRCULATION_SERVICE_URL || 'http://localhost:3002';
const catalogApi = new apiClient_1.ApiClient(CATALOG_SERVICE_URL, 'Reporting->Catalog');
const circulationApi = new apiClient_1.ApiClient(CIRCULATION_SERVICE_URL, 'Reporting->Circulation');
class DashboardService {
    async getDashboardStats() {
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
            const availableBooks = booksArray.filter((book) => book.availability === true);
            const stats = {
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
        }
        catch (error) {
            console.error('Error fetching dashboard stats:', error);
            throw new Error('Failed to fetch dashboard statistics');
        }
    }
    async saveDashboardStats(stats) {
        try {
            await Report_1.DashboardModel.findOneAndUpdate({}, {
                ...stats,
                lastUpdated: new Date()
            }, { upsert: true, new: true });
        }
        catch (error) {
            console.error('Error saving dashboard stats:', error);
        }
    }
    async getStoredDashboardStats() {
        try {
            const dashboard = await Report_1.DashboardModel.findOne().sort({ lastUpdated: -1 });
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
        }
        catch (error) {
            console.error('Error fetching stored dashboard stats:', error);
            return null;
        }
    }
}
exports.DashboardService = DashboardService;
