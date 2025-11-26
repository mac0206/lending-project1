"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanRepository = void 0;
const Loan_1 = require("../../../models/Loan");
class LoanRepository {
    async create(loanData) {
        const loan = new Loan_1.LoanModel(loanData);
        return await loan.save();
    }
    async findAll() {
        return await Loan_1.LoanModel.find();
    }
    async findById(id) {
        return await Loan_1.LoanModel.findById(id);
    }
    async findByBookId(bookId) {
        return await Loan_1.LoanModel.find({ bookId });
    }
    async findByMemberId(memberId) {
        return await Loan_1.LoanModel.find({ memberId });
    }
    async findActiveLoanByBookId(bookId) {
        return await Loan_1.LoanModel.findOne({ bookId, status: 'active' });
    }
    async findOverdueLoans() {
        return await Loan_1.LoanModel.find({ status: 'overdue' });
    }
    async findActiveLoans() {
        return await Loan_1.LoanModel.find({ status: 'active' });
    }
    async update(id, loanData) {
        return await Loan_1.LoanModel.findByIdAndUpdate(id, loanData, { new: true });
    }
    async delete(id) {
        const result = await Loan_1.LoanModel.findByIdAndDelete(id);
        return !!result;
    }
    async updateOverdueStatus() {
        const now = new Date();
        await Loan_1.LoanModel.updateMany({ status: 'active', dueDate: { $lt: now }, returnDate: null }, { $set: { isOverdue: true, status: 'overdue' } });
    }
}
exports.LoanRepository = LoanRepository;
