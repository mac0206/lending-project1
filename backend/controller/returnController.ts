import { Request, Response } from 'express';
import { ReturnService } from '../circulation-service/src/services/returnService';

export class ReturnController {
  private returnService: ReturnService;

  constructor() {
    this.returnService = new ReturnService();
  }

  returnBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const loan = await this.returnService.returnBook(req.params.loanId);
      if (!loan) {
        res.status(404).json({ error: 'Loan not found' });
        return;
      }
      res.json(loan);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  returnBookByBookId = async (req: Request, res: Response): Promise<void> => {
    try {
      // Support both itemId and bookId
      const itemId = req.body.itemId || req.params.bookId || req.body.bookId;
      if (!itemId) {
        res.status(400).json({
          success: false,
          error: 'itemId (or bookId) is required'
        });
        return;
      }
      const loan = await this.returnService.returnBookByBookId(itemId);
      if (!loan) {
        res.status(404).json({
          success: false,
          error: 'No active loan found for this item'
        });
        return;
      }
      res.json({
        success: true,
        data: loan,
        message: 'The librarian has successfully returned the item to the library'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to return item'
      });
    }
  };

  updateOverdueItems = async (req: Request, res: Response): Promise<void> => {
    try {
      const count = await this.returnService.updateOverdueItems();
      res.json({ updated: count, message: `Updated ${count} overdue items` });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}

