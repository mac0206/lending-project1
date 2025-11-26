import axios from 'axios';
import { Item, Member, ItemType } from '@library-system/shared';

const API_BASE_URL = import.meta.env.VITE_CATALOG_API_URL ?? '/api/catalog';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const catalogApi = {
  // Items (Member A requirements)
  getItems: async (): Promise<Item[]> => {
    const response = await api.get('/items');
    return response.data.data || response.data;
  },

  getItem: async (id: string): Promise<Item> => {
    const response = await api.get(`/items/${id}`);
    return response.data.data || response.data;
  },

  getAvailableItems: async (): Promise<Item[]> => {
    const response = await api.get('/items/available');
    return response.data.data || response.data;
  },

  createItem: async (item: Omit<Item, '_id'>): Promise<Item> => {
    const response = await api.post('/items', item);
    return response.data.data || response.data;
  },

  updateItem: async (id: string, item: Partial<Item>): Promise<Item> => {
    const response = await api.put(`/items/${id}`, item);
    return response.data.data || response.data;
  },

  deleteItem: async (id: string): Promise<void> => {
    await api.delete(`/items/${id}`);
  },

  // Legacy Books API (for backward compatibility)
  getBooks: async (): Promise<Item[]> => {
    const response = await api.get('/books');
    return response.data.data || response.data;
  },

  getBook: async (id: string): Promise<Item> => {
    const response = await api.get(`/books/${id}`);
    return response.data.data || response.data;
  },

  getAvailableBooks: async (): Promise<Item[]> => {
    const response = await api.get('/books/available');
    return response.data.data || response.data;
  },

  createBook: async (book: Omit<Item, '_id'>): Promise<Item> => {
    const response = await api.post('/books', book);
    return response.data.data || response.data;
  },

  updateBook: async (id: string, book: Partial<Item>): Promise<Item> => {
    const response = await api.put(`/books/${id}`, book);
    return response.data.data || response.data;
  },

  deleteBook: async (id: string): Promise<void> => {
    await api.delete(`/books/${id}`);
  },

  // Members (Member A requirements)
  getMembers: async (): Promise<Member[]> => {
    const response = await api.get('/members');
    return response.data.data || response.data;
  },

  getMember: async (id: string): Promise<Member> => {
    const response = await api.get(`/members/${id}`);
    return response.data.data || response.data;
  },

  getMemberByStudentId: async (studentId: string): Promise<Member> => {
    const response = await api.get(`/members/student/${studentId}`);
    return response.data.data || response.data;
  },

  createMember: async (member: Omit<Member, '_id'>): Promise<Member> => {
    const response = await api.post('/members', member);
    return response.data.data || response.data;
  },

  updateMember: async (id: string, member: Partial<Member>): Promise<Member> => {
    const response = await api.put(`/members/${id}`, member);
    return response.data.data || response.data;
  },

  deleteMember: async (id: string): Promise<void> => {
    await api.delete(`/members/${id}`);
  }
};

export type { ItemType };

