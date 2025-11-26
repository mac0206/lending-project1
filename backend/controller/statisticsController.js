"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticsController = void 0;
const statisticsService_1 = require("../reporting-service/src/services/statisticsService");
class StatisticsController {
    constructor() {
        this.getMostBorrowedBooks = async (req, res) => {
            try {
                const limit = parseInt(req.query.limit) || 10;
                const stats = await this.statisticsService.getMostBorrowedBooks(limit);
                res.json(stats);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
        this.getBorrowingHistory = async (req, res) => {
            try {
                const { memberId, itemId, startDate, endDate } = req.query;
                // Support both itemId and bookId
                const actualItemId = itemId || req.query.bookId;
                const history = await this.statisticsService.getBorrowingHistory(memberId, actualItemId);
                // Filter by date range if provided
                let filteredHistory = history;
                if (startDate || endDate) {
                    filteredHistory = history.filter((item) => {
                        const borrowDate = new Date(item.loan.borrowDate);
                        if (startDate && borrowDate < new Date(startDate))
                            return false;
                        if (endDate && borrowDate > new Date(endDate))
                            return false;
                        return true;
                    });
                }
                res.json({
                    success: true,
                    data: filteredHistory,
                    count: filteredHistory.length
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message || 'Failed to fetch borrowing history'
                });
            }
        };
        this.getOverdueBooks = async (req, res) => {
            try {
                const overdueBooks = await this.statisticsService.getOverdueBooks();
                res.json({
                    success: true,
                    data: overdueBooks,
                    count: overdueBooks.length,
                    message: overdueBooks.length > 0
                        ? `${overdueBooks.length} item(s) are overdue`
                        : 'No overdue items'
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message || 'Failed to fetch overdue items'
                });
            }
        };
        this.getMemberBorrowingStats = async (req, res) => {
            try {
                const limit = parseInt(req.query.limit) || 10;
                const stats = await this.statisticsService.getMemberBorrowingStats(limit);
                res.json(stats);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
        this.statisticsService = new statisticsService_1.StatisticsService();
    }
}
exports.StatisticsController = StatisticsController;
