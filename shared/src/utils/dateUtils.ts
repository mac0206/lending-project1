export const calculateDueDate = (borrowDate: Date, days: number = 14): Date => {
  const dueDate = new Date(borrowDate);
  dueDate.setDate(dueDate.getDate() + days);
  return dueDate;
};

export const isOverdue = (dueDate: Date, returnDate?: Date): boolean => {
  const now = returnDate || new Date();
  return now > dueDate;
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

