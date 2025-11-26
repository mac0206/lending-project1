export interface Member {
    _id?: string;
    name: string;
    studentId: string;
    borrowedItems: string[];
    email?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
