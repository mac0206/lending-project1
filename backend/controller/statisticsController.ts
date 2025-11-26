import { Request, Response } from 'express';
import { StatisticsService } from '../reporting-service/src/services/statisticsService';

export class StatisticsController {
  private statisticsService: StatisticsService;

  constructor() {
    this.statisticsService = new StatisticsService();
  }

  getMostBorrowedBooks = async (req: Request, res: Response): Promise<void> => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const stats = await this.statisticsService.getMostBorrowedBooks(limit);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getBorrowingHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { memberId, itemId, startDate, endDate } = req.query;
      // Support both itemId and bookId
      const actualItemId = (itemId as string) || (req.query.bookId as string);
      const history = await this.statisticsService.getBorrowingHistory(
        memberId as string,
        actualItemId
      );
      
      // Filter by date range if provided
      let filteredHistory = history;
      if (startDate || endDate) {
        filteredHistory = history.filter((item) => {
          const borrowDate = new Date(item.loan.borrowDate);
          if (startDate && borrowDate < new Date(startDate as string)) return false;
          if (endDate && borrowDate > new Date(endDate as string)) return false;
          return true;
        });
      }
      
      res.json({
        success: true,
        data: filteredHistory,
        count: filteredHistory.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch borrowing history'
      });
    }
  };

  getOverdueBooks = async (req: Request, res: Response): Promise<void> => {
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
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch overdue items'
      });
    }
  };

  getMemberBorrowingStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const stats = await this.statisticsService.getMemberBorrowingStats(limit);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}

