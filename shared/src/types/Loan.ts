export interface Loan {
  _id?: string;
  bookId: string;
  memberId: string;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  isOverdue: boolean;
  status: 'active' | 'returned' | 'overdue';
  createdAt?: Date;
  updatedAt?: Date;
}

