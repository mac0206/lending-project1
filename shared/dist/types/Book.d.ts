export type ItemType = 'book' | 'magazine' | 'journal' | 'dvd' | 'other';
export interface Item {
    _id?: string;
    title: string;
    type: ItemType;
    availability: boolean;
    owner: string;
    author?: string;
    isbn?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface Book extends Item {
    author: string;
}
