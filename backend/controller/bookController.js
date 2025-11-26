"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookController = void 0;
// Use default import that matches the default export above.
// Adjust filename casing to match the actual file on disk (BookService.ts vs bookService.ts)
const bookService_1 = __importDefault(require("../catalog-service/src/services/bookService"));
class BookController {
    constructor() {
        this.createBook = async (req, res) => {
            try {
                const book = await this.bookService.createBook(req.body);
                res.status(201).json(book);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
        this.getAllBooks = async (req, res) => {
            try {
                const books = await this.bookService.getAllBooks();
                res.json(books);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
        this.getBookById = async (req, res) => {
            try {
                const book = await this.bookService.getBookById(req.params.id);
                if (!book) {
                    res.status(404).json({ error: 'Book not found' });
                    return;
                }
                res.json(book);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
        this.updateBook = async (req, res) => {
            try {
                const book = await this.bookService.updateBook(req.params.id, req.body);
                if (!book) {
                    res.status(404).json({ error: 'Book not found' });
                    return;
                }
                res.json(book);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
        this.deleteBook = async (req, res) => {
            try {
                const deleted = await this.bookService.deleteBook(req.params.id);
                if (!deleted) {
                    res.status(404).json({ error: 'Book not found' });
                    return;
                }
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
        this.getAvailableBooks = async (req, res) => {
            try {
                const books = await this.bookService.getAvailableBooks();
                res.json(books);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
        this.getBooksByAuthor = async (req, res) => {
            try {
                const books = await this.bookService.getBooksByAuthor(req.params.author);
                res.json(books);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
        this.bookService = new bookService_1.default();
    }
}
exports.BookController = BookController;
