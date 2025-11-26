"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemController = void 0;
const bookService_1 = __importDefault(require("../catalog-service/src/services/bookService"));
class ItemController {
    constructor() {
        this.createItem = async (req, res) => {
            try {
                const item = await this.itemService.createItem(req.body);
                res.status(201).json({
                    success: true,
                    data: item,
                    message: 'Item created successfully'
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    error: error.message || 'Failed to create item'
                });
            }
        };
        this.getAllItems = async (req, res) => {
            try {
                const items = await this.itemService.getAllItems();
                res.json({
                    success: true,
                    data: items,
                    count: items.length
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message || 'Failed to fetch items'
                });
            }
        };
        this.getItemById = async (req, res) => {
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
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message || 'Failed to fetch item'
                });
            }
        };
        this.updateItem = async (req, res) => {
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
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    error: error.message || 'Failed to update item'
                });
            }
        };
        this.deleteItem = async (req, res) => {
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
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message || 'Failed to delete item'
                });
            }
        };
        this.getAvailableItems = async (req, res) => {
            try {
                const items = await this.itemService.getAvailableItems();
                res.json({
                    success: true,
                    data: items,
                    count: items.length
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message || 'Failed to fetch available items'
                });
            }
        };
        this.getItemsByOwner = async (req, res) => {
            try {
                const items = await this.itemService.getItemsByOwner(req.params.owner);
                res.json({
                    success: true,
                    data: items,
                    count: items.length
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message || 'Failed to fetch items by owner'
                });
            }
        };
        this.getItemsByType = async (req, res) => {
            try {
                const items = await this.itemService.getItemsByType(req.params.type);
                res.json({
                    success: true,
                    data: items,
                    count: items.length
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message || 'Failed to fetch items by type'
                });
            }
        };
        this.itemService = new bookService_1.default();
    }
}
exports.ItemController = ItemController;
