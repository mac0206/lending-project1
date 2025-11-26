import { Document } from 'mongoose';
import { Item } from '@library-system/shared';
import { ItemModel } from '../../../models/Book';

export default class ItemRepository {
  async create(data: Partial<Item>): Promise<Document | any> {
    return ItemModel.create(data);
  }

  async findAll(): Promise<Document[] | any[]> {
    return ItemModel.find().exec();
  }

  async findById(id: string): Promise<Document | null> {
    return ItemModel.findById(id).exec();
  }

  async update(id: string, data: Partial<Item>): Promise<Document | null> {
    return ItemModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const doc = await ItemModel.findByIdAndDelete(id).exec();
    return !!doc;
  }

  async findByAvailability(available: boolean): Promise<Document[] | any[]> {
    return ItemModel.find({ availability: available }).exec();
  }

  async findByOwner(owner: string): Promise<Document[] | any[]> {
    return ItemModel.find({ owner }).exec();
  }

  async findByType(type: string): Promise<Document[] | any[]> {
    return ItemModel.find({ type }).exec();
  }
}