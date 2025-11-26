import { Request, Response } from 'express';
import { LoanService } from '../circulation-service/src/services/loanService';

export class LoanController {
  private loanService: LoanService;

  constructor() {
    this.loanService = new LoanService();
  }

  createLoan = async (req: Request, res: Response): Promise<void> => {
    try {
      const { itemId, borrowerMemberId, days } = req.body;
      // Support both itemId and bookId for backward compatibility
      const actualItemId = itemId || req.body.bookId;
      const actualMemberId = borrowerMemberId || req.body.memberId;
      
      if (!actualItemId || !actualMemberId) {
        res.status(400).json({
          success: false,
          error: 'itemId (or bookId) and borrowerMemberId (or memberId) are required'
        });
        return;
      }
      const loan = await this.loanService.createLoan(actualItemId, actualMemberId, days || 14);
      res.status(201).json({
        success: true,
        data: loan,
        message: 'Item borrowed successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to borrow item'
      });
    }
  };

  getAllLoans = async (req: Request, res: Response): Promise<void> => {
    try {
      const loans = await this.loanService.getAllLoans();
      res.json(loans);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getLoanById = async (req: Request, res: Response): Promise<void> => {
    try {
      const loan = await this.loanService.getLoanById(req.params.id);
      if (!loan) {
        res.status(404).json({ error: 'Loan not found' });
        return;
      }
      res.json(loan);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getLoansByMemberId = async (req: Request, res: Response): Promise<void> => {
    try {
      const loans = await this.loanService.getLoansByMemberId(req.params.memberId);
      res.json(loans);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getLoansByBookId = async (req: Request, res: Response): Promise<void> => {
    try {
      const loans = await this.loanService.getLoansByBookId(req.params.bookId);
      res.json(loans);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getOverdueLoans = async (req: Request, res: Response): Promise<void> => {
    try {
      const loans = await this.loanService.getOverdueLoans();
      res.json(loans);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getActiveLoans = async (req: Request, res: Response): Promise<void> => {
    try {
      const loans = await this.loanService.getActiveLoans();
      res.json(loans);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  checkAvailability = async (req: Request, res: Response): Promise<void> => {
    try {
      const isAvailable = await this.loanService.checkBookAvailability(req.params.bookId);
      res.json({ available: isAvailable });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}

