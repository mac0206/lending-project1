import { Request, Response } from 'express';
// Use default import that matches the default export above.
// Adjust filename casing to match the actual file on disk (BookService.ts vs bookService.ts)
import BookService from '../catalog-service/src/services/bookService';

export class BookController {
  private bookService: any;

  constructor() {
    this.bookService = new BookService();
  }

  createBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const book = await this.bookService.createBook(req.body);
      res.status(201).json(book);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getAllBooks = async (req: Request, res: Response): Promise<void> => {
    try {
      const books = await this.bookService.getAllBooks();
      res.json(books);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getBookById = async (req: Request, res: Response): Promise<void> => {
    try {
      const book = await this.bookService.getBookById(req.params.id);
      if (!book) {
        res.status(404).json({ error: 'Book not found' });
        return;
      }
      res.json(book);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  updateBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const book = await this.bookService.updateBook(req.params.id, req.body);
      if (!book) {
        res.status(404).json({ error: 'Book not found' });
        return;
      }
      res.json(book);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  deleteBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const deleted = await this.bookService.deleteBook(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: 'Book not found' });
        return;
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getAvailableBooks = async (req: Request, res: Response): Promise<void> => {
    try {
      const books = await this.bookService.getAvailableBooks();
      res.json(books);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getBooksByAuthor = async (req: Request, res: Response): Promise<void> => {
    try {
      const books = await this.bookService.getBooksByAuthor(req.params.author);
      res.json(books);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}

