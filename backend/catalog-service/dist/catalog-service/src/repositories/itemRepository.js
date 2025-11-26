"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Book_1 = require("../../../models/Book");
class ItemRepository {
    async create(data) {
        return Book_1.ItemModel.create(data);
    }
    async findAll() {
        return Book_1.ItemModel.find().exec();
    }
    async findById(id) {
        return Book_1.ItemModel.findById(id).exec();
    }
    async update(id, data) {
        return Book_1.ItemModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }
    async delete(id) {
        const doc = await Book_1.ItemModel.findByIdAndDelete(id).exec();
        return !!doc;
    }
    async findByAvailability(available) {
        return Book_1.ItemModel.find({ availability: available }).exec();
    }
    async findByOwner(owner) {
        return Book_1.ItemModel.find({ owner }).exec();
    }
    async findByType(type) {
        return Book_1.ItemModel.find({ type }).exec();
    }
}
exports.default = ItemRepository;
