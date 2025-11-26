import { Request, Response } from 'express';
import ItemService from '../catalog-service/src/services/bookService';

export class ItemController {
  private itemService: any;

  constructor() {
    this.itemService = new ItemService();
  }

  createItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const item = await this.itemService.createItem(req.body);
      res.status(201).json({
        success: true,
        data: item,
        message: 'Item created successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to create item'
      });
    }
  };

  getAllItems = async (req: Request, res: Response): Promise<void> => {
    try {
      const items = await this.itemService.getAllItems();
      res.json({
        success: true,
        data: items,
        count: items.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch items'
      });
    }
  };

  getItemById = async (req: Request, res: Response): Promise<void> => {
    try {
      const item = await this.itemService.getItemById(req.params.id);
      if (!item) {
        res.status(404).json({
          success: false,
          error: 'Item not found'
        });
        return;
      }
      res.json({
        success: true,
        data: item
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch item'
      });
    }
  };

  updateItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const item = await this.itemService.updateItem(req.params.id, req.body);
      if (!item) {
        res.status(404).json({
          success: false,
          error: 'Item not found'
        });
        return;
      }
      res.json({
        success: true,
        data: item,
        message: 'Item updated successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to update item'
      });
    }
  };

  deleteItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const deleted = await this.itemService.deleteItem(req.params.id);
      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Item not found'
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: 'Item deleted successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to delete item'
      });
    }
  };

  getAvailableItems = async (req: Request, res: Response): Promise<void> => {
    try {
      const items = await this.itemService.getAvailableItems();
      res.json({
        success: true,
        data: items,
        count: items.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch available items'
      });
    }
  };

  getItemsByOwner = async (req: Request, res: Response): Promise<void> => {
    try {
      const items = await this.itemService.getItemsByOwner(req.params.owner);
      res.json({
        success: true,
        data: items,
        count: items.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch items by owner'
      });
    }
  };

  getItemsByType = async (req: Request, res: Response): Promise<void> => {
    try {
      const items = await this.itemService.getItemsByType(req.params.type);
      res.json({
        success: true,
        data: items,
        count: items.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch items by type'
      });
    }
  };
}

