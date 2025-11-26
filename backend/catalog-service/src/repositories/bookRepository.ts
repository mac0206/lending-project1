import { ItemModel, ItemDocument } from '../../../models/Book';
import { Item } from '@library-system/shared';

export class ItemRepository {
  async create(itemData: Omit<Item, '_id'>): Promise<ItemDocument> {
    // Validate owner is provided
    if (!itemData.owner || itemData.owner.trim() === '') {
      throw new Error('Item must have an owner');
    }
    
    // Validate type is valid
    const validTypes = ['book', 'magazine', 'journal', 'dvd', 'other'];
    if (!validTypes.includes(itemData.type)) {
      throw new Error(`Item type must be one of: ${validTypes.join(', ')}`);
    }

    const item = new ItemModel(itemData);
    return await item.save();
  }

  async findAll(): Promise<ItemDocument[]> {
    return await ItemModel.find().sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<ItemDocument | null> {
    return await ItemModel.findById(id);
  }

  async update(id: string, itemData: Partial<Item>): Promise<ItemDocument | null> {
    // Validate type if provided
    if (itemData.type) {
      const validTypes = ['book', 'magazine', 'journal', 'dvd', 'other'];
      if (!validTypes.includes(itemData.type)) {
        throw new Error(`Item type must be one of: ${validTypes.join(', ')}`);
      }
    }
    
    return await ItemModel.findByIdAndUpdate(id, itemData, { new: true, runValidators: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await ItemModel.findByIdAndDelete(id);
    return !!result;
  }

  async findByAvailability(available: boolean): Promise<ItemDocument[]> {
    return await ItemModel.find({ availability: available }).sort({ createdAt: -1 });
  }

  async findByOwner(owner: string): Promise<ItemDocument[]> {
    return await ItemModel.find({ owner: { $regex: owner, $options: 'i' } }).sort({ createdAt: -1 });
  }

  async findByType(type: string): Promise<ItemDocument[]> {
    return await ItemModel.find({ type }).sort({ createdAt: -1 });
  }
}

