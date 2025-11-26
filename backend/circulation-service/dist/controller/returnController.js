"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReturnController = void 0;
const returnService_1 = require("../circulation-service/src/services/returnService");
class ReturnController {
    constructor() {
        this.returnBook = async (req, res) => {
            try {
                const loan = await this.returnService.returnBook(req.params.loanId);
                if (!loan) {
                    res.status(404).json({ error: 'Loan not found' });
                    return;
                }
                res.json(loan);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
        this.returnBookByBookId = async (req, res) => {
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
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    error: error.message || 'Failed to return item'
                });
            }
        };
        this.updateOverdueItems = async (req, res) => {
            try {
                const count = await this.returnService.updateOverdueItems();
                res.json({ updated: count, message: `Updated ${count} overdue items` });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
        this.returnService = new returnService_1.ReturnService();
    }
}
exports.ReturnController = ReturnController;
