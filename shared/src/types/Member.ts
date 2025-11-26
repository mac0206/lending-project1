export interface Member {
  _id?: string;
  name: string;
  studentId: string;
  borrowedItems: string[]; // Array of book IDs
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

