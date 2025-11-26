"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanController = void 0;
const loanService_1 = require("../circulation-service/src/services/loanService");
class LoanController {
    constructor() {
        this.createLoan = async (req, res) => {
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
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    error: error.message || 'Failed to borrow item'
                });
            }
        };
        this.getAllLoans = async (req, res) => {
            try {
                const loans = await this.loanService.getAllLoans();
                res.json(loans);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
        this.getLoanById = async (req, res) => {
            try {
                const loan = await this.loanService.getLoanById(req.params.id);
                if (!loan) {
                    res.status(404).json({ error: 'Loan not found' });
                    return;
                }
                res.json(loan);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
        this.getLoansByMemberId = async (req, res) => {
            try {
                const loans = await this.loanService.getLoansByMemberId(req.params.memberId);
                res.json(loans);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
        this.getLoansByBookId = async (req, res) => {
            try {
                const loans = await this.loanService.getLoansByBookId(req.params.bookId);
                res.json(loans);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
        this.getOverdueLoans = async (req, res) => {
            try {
                const loans = await this.loanService.getOverdueLoans();
                res.json(loans);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
        this.getActiveLoans = async (req, res) => {
            try {
                const loans = await this.loanService.getActiveLoans();
                res.json(loans);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
        this.checkAvailability = async (req, res) => {
            try {
                const isAvailable = await this.loanService.checkBookAvailability(req.params.bookId);
                res.json({ available: isAvailable });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
        this.loanService = new loanService_1.LoanService();
    }
}
exports.LoanController = LoanController;
