import { Item } from '@library-system/shared';
import ItemRepository from '../repositories/itemRepository';

export default class BookService {
  private itemRepository: ItemRepository;

  constructor() {
    this.itemRepository = new ItemRepository();
  }

  // Convert mongoose doc -> shared Item (ensure _id is a string)
  private toItem(doc: any): Item {
    if (!doc) return doc;
    const obj = typeof doc.toObject === 'function' ? doc.toObject() : doc;
    const id = obj._id?.toString ? obj._id.toString() : String(obj._id ?? '');
    return { ...obj, _id: id } as Item;
  }

  async createBook(itemData: Partial<Item>): Promise<Item> {
    const doc = await this.itemRepository.create(itemData);
    return this.toItem(doc);
  }

  async getAllBooks(): Promise<Item[]> {
    const docs = await this.itemRepository.findAll();
    return (docs || []).map((d: any) => this.toItem(d));
  }

  async getBookById(id: string): Promise<Item | null> {
    const doc = await this.itemRepository.findById(id);
    return doc ? this.toItem(doc) : null;
  }

  async updateBook(id: string, itemData: Partial<Item>): Promise<Item | null> {
    const doc = await this.itemRepository.update(id, itemData);
    return doc ? this.toItem(doc) : null;
  }

  async deleteBook(id: string): Promise<boolean> {
    return await this.itemRepository.delete(id);
  }

  async getAvailableBooks(): Promise<Item[]> {
    const docs = await this.itemRepository.findByAvailability(true);
    return (docs || []).map((d: any) => this.toItem(d));
  }

  async getBooksByOwner(owner: string): Promise<Item[]> {
    const docs = await this.itemRepository.findByOwner(owner);
    return (docs || []).map((d: any) => this.toItem(d));
  }

  async getBooksByType(type: string): Promise<Item[]> {
    const docs = await this.itemRepository.findByType(type);
    return (docs || []).map((d: any) => this.toItem(d));
  }

  // Compatibility aliases (some controllers/services call these older names)
  async getAllItems(): Promise<Item[]> { return this.getAllBooks(); }
  async getItemById(id: string): Promise<Item | null> { return this.getBookById(id); }
  async createItem(itemData: Partial<Item>): Promise<Item> { return this.createBook(itemData); }
  async updateItem(id: string, itemData: Partial<Item>): Promise<Item | null> { return this.updateBook(id, itemData); }
  async deleteItem(id: string): Promise<boolean> { return this.deleteBook(id); }
  async getAvailableItems(): Promise<Item[]> { return this.getAvailableBooks(); }
  async getItemsByOwner(owner: string): Promise<Item[]> { return this.getBooksByOwner(owner); }
  async getItemsByType(type: string): Promise<Item[]> { return this.getBooksByType(type); }
}