"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = exports.isOverdue = exports.calculateDueDate = void 0;
const calculateDueDate = (borrowDate, days = 14) => {
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + days);
    return dueDate;
};
exports.calculateDueDate = calculateDueDate;
const isOverdue = (dueDate, returnDate) => {
    const now = returnDate || new Date();
    return now > dueDate;
};
exports.isOverdue = isOverdue;
const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};
exports.formatDate = formatDate;
