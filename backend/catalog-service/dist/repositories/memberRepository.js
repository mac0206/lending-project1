"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberRepository = void 0;
const Member_1 = require("../../../models/Member");
class MemberRepository {
    async create(memberData) {
        const member = new Member_1.MemberModel(memberData);
        return await member.save();
    }
    async findAll() {
        return await Member_1.MemberModel.find();
    }
    async findById(id) {
        return await Member_1.MemberModel.findById(id);
    }
    async findByStudentId(studentId) {
        return await Member_1.MemberModel.findOne({ studentId });
    }
    async update(id, memberData) {
        return await Member_1.MemberModel.findByIdAndUpdate(id, memberData, { new: true });
    }
    async delete(id) {
        const result = await Member_1.MemberModel.findByIdAndDelete(id);
        return !!result;
    }
    async addBorrowedItem(memberId, bookId) {
        return await Member_1.MemberModel.findByIdAndUpdate(memberId, { $addToSet: { borrowedItems: bookId } }, { new: true });
    }
    async removeBorrowedItem(memberId, bookId) {
        return await Member_1.MemberModel.findByIdAndUpdate(memberId, { $pull: { borrowedItems: bookId } }, { new: true });
    }
}
exports.MemberRepository = MemberRepository;
