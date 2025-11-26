"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemRepository = void 0;
const Book_1 = require("../../../models/Book");
class ItemRepository {
    async create(itemData) {
        // Validate owner is provided
        if (!itemData.owner || itemData.owner.trim() === '') {
            throw new Error('Item must have an owner');
        }
        // Validate type is valid
        const validTypes = ['book', 'magazine', 'journal', 'dvd', 'other'];
        if (!validTypes.includes(itemData.type)) {
            throw new Error(`Item type must be one of: ${validTypes.join(', ')}`);
        }
        const item = new Book_1.ItemModel(itemData);
        return await item.save();
    }
    async findAll() {
        return await Book_1.ItemModel.find().sort({ createdAt: -1 });
    }
    async findById(id) {
        return await Book_1.ItemModel.findById(id);
    }
    async update(id, itemData) {
        // Validate type if provided
        if (itemData.type) {
            const validTypes = ['book', 'magazine', 'journal', 'dvd', 'other'];
            if (!validTypes.includes(itemData.type)) {
                throw new Error(`Item type must be one of: ${validTypes.join(', ')}`);
            }
        }
        return await Book_1.ItemModel.findByIdAndUpdate(id, itemData, { new: true, runValidators: true });
    }
    async delete(id) {
        const result = await Book_1.ItemModel.findByIdAndDelete(id);
        return !!result;
    }
    async findByAvailability(available) {
        return await Book_1.ItemModel.find({ availability: available }).sort({ createdAt: -1 });
    }
    async findByOwner(owner) {
        return await Book_1.ItemModel.find({ owner: { $regex: owner, $options: 'i' } }).sort({ createdAt: -1 });
    }
    async findByType(type) {
        return await Book_1.ItemModel.find({ type }).sort({ createdAt: -1 });
    }
}
exports.ItemRepository = ItemRepository;
