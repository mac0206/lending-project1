import { MemberModel, MemberDocument } from '../../../models/Member';
import { Member } from '@library-system/shared';

export class MemberRepository {
  async create(memberData: Omit<Member, '_id'>): Promise<MemberDocument> {
    const member = new MemberModel(memberData);
    return await member.save();
  }

  async findAll(): Promise<MemberDocument[]> {
    return await MemberModel.find();
  }

  async findById(id: string): Promise<MemberDocument | null> {
    return await MemberModel.findById(id);
  }

  async findByStudentId(studentId: string): Promise<MemberDocument | null> {
    return await MemberModel.findOne({ studentId });
  }

  async update(id: string, memberData: Partial<Member>): Promise<MemberDocument | null> {
    return await MemberModel.findByIdAndUpdate(id, memberData, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await MemberModel.findByIdAndDelete(id);
    return !!result;
  }

  async addBorrowedItem(memberId: string, bookId: string): Promise<MemberDocument | null> {
    return await MemberModel.findByIdAndUpdate(
      memberId,
      { $addToSet: { borrowedItems: bookId } },
      { new: true }
    );
  }

  async removeBorrowedItem(memberId: string, bookId: string): Promise<MemberDocument | null> {
    return await MemberModel.findByIdAndUpdate(
      memberId,
      { $pull: { borrowedItems: bookId } },
      { new: true }
    );
  }
}

