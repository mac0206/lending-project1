"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const memberRepository_1 = require("../repositories/memberRepository");
class MemberService {
    constructor() {
        this.memberRepository = new memberRepository_1.MemberRepository();
    }
    toMember(doc) {
        if (!doc)
            return doc;
        const obj = typeof doc.toObject === 'function' ? doc.toObject() : doc;
        const id = obj._id?.toString ? obj._id.toString() : String(obj._id ?? '');
        return { ...obj, _id: id };
    }
    async createMember(memberData) {
        const existingMember = await this.memberRepository.findByStudentId(memberData.studentId);
        if (existingMember) {
            throw new Error('Student ID already exists');
        }
        const created = await this.memberRepository.create(memberData);
        return this.toMember(created);
    }
    async getAllMembers() {
        const docs = await this.memberRepository.findAll();
        return (docs || []).map((d) => this.toMember(d));
    }
    async getMemberById(id) {
        const doc = await this.memberRepository.findById(id);
        return doc ? this.toMember(doc) : null;
    }
    async getMemberByStudentId(studentId) {
        const doc = await this.memberRepository.findByStudentId(studentId);
        return doc ? this.toMember(doc) : null;
    }
    async updateMember(id, memberData) {
        const doc = await this.memberRepository.update(id, memberData);
        return doc ? this.toMember(doc) : null;
    }
    async deleteMember(id) {
        return await this.memberRepository.delete(id);
    }
    async addBorrowedItem(memberId, bookId) {
        const doc = await this.memberRepository.addBorrowedItem(memberId, bookId);
        return doc ? this.toMember(doc) : null;
    }
    async removeBorrowedItem(memberId, bookId) {
        const doc = await this.memberRepository.removeBorrowedItem(memberId, bookId);
        return doc ? this.toMember(doc) : null;
    }
}
exports.default = MemberService;
