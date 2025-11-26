"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const itemRepository_1 = __importDefault(require("../repositories/itemRepository"));
class BookService {
    constructor() {
        this.itemRepository = new itemRepository_1.default();
    }
    // Convert mongoose doc -> shared Item (ensure _id is a string)
    toItem(doc) {
        if (!doc)
            return doc;
        const obj = typeof doc.toObject === 'function' ? doc.toObject() : doc;
        const id = obj._id?.toString ? obj._id.toString() : String(obj._id ?? '');
        return { ...obj, _id: id };
    }
    async createBook(itemData) {
        const doc = await this.itemRepository.create(itemData);
        return this.toItem(doc);
    }
    async getAllBooks() {
        const docs = await this.itemRepository.findAll();
        return (docs || []).map((d) => this.toItem(d));
    }
    async getBookById(id) {
        const doc = await this.itemRepository.findById(id);
        return doc ? this.toItem(doc) : null;
    }
    async updateBook(id, itemData) {
        const doc = await this.itemRepository.update(id, itemData);
        return doc ? this.toItem(doc) : null;
    }
    async deleteBook(id) {
        return await this.itemRepository.delete(id);
    }
    async getAvailableBooks() {
        const docs = await this.itemRepository.findByAvailability(true);
        return (docs || []).map((d) => this.toItem(d));
    }
    async getBooksByOwner(owner) {
        const docs = await this.itemRepository.findByOwner(owner);
        return (docs || []).map((d) => this.toItem(d));
    }
    async getBooksByType(type) {
        const docs = await this.itemRepository.findByType(type);
        return (docs || []).map((d) => this.toItem(d));
    }
    // Compatibility aliases (some controllers/services call these older names)
    async getAllItems() { return this.getAllBooks(); }
    async getItemById(id) { return this.getBookById(id); }
    async createItem(itemData) { return this.createBook(itemData); }
    async updateItem(id, itemData) { return this.updateBook(id, itemData); }
    async deleteItem(id) { return this.deleteBook(id); }
    async getAvailableItems() { return this.getAvailableBooks(); }
    async getItemsByOwner(owner) { return this.getBooksByOwner(owner); }
    async getItemsByType(type) { return this.getBooksByType(type); }
}
exports.default = BookService;
