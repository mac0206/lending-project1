export type ItemType = 'book' | 'magazine' | 'journal' | 'dvd' | 'other';

export interface Item {
  _id?: string;
  title: string;
  type: ItemType;
  availability: boolean;
  owner: string; // Required field
  author?: string; // Optional for non-book items
  isbn?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Keep Book interface for backward compatibility
export interface Book extends Item {
  author: string;
}

