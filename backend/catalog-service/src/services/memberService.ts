import { Member } from '@library-system/shared';
import { MemberRepository } from '../repositories/memberRepository';

export default class MemberService {
  private memberRepository: MemberRepository;

  constructor() {
    this.memberRepository = new MemberRepository();
  }

  private toMember(doc: any): Member {
    if (!doc) return doc;
    const obj = typeof doc.toObject === 'function' ? doc.toObject() : doc;
    const id = obj._id?.toString ? obj._id.toString() : String(obj._id ?? '');
    return { ...obj, _id: id } as Member;
  }

  async createMember(memberData: Omit<Member, '_id'>): Promise<Member> {
    const existingMember = await this.memberRepository.findByStudentId(memberData.studentId);
    if (existingMember) {
      throw new Error('Student ID already exists');
    }

    const created = await this.memberRepository.create(memberData);
    return this.toMember(created);
  }

  async getAllMembers(): Promise<Member[]> {
    const docs = await this.memberRepository.findAll();
    return (docs || []).map((d: any) => this.toMember(d));
  }

  async getMemberById(id: string): Promise<Member | null> {
    const doc = await this.memberRepository.findById(id);
    return doc ? this.toMember(doc) : null;
  }

  async getMemberByStudentId(studentId: string): Promise<Member | null> {
    const doc = await this.memberRepository.findByStudentId(studentId);
    return doc ? this.toMember(doc) : null;
  }

  async updateMember(id: string, memberData: Partial<Member>): Promise<Member | null> {
    const doc = await this.memberRepository.update(id, memberData);
    return doc ? this.toMember(doc) : null;
  }

  async deleteMember(id: string): Promise<boolean> {
    return await this.memberRepository.delete(id);
  }

  async addBorrowedItem(memberId: string, bookId: string): Promise<Member | null> {
    const doc = await this.memberRepository.addBorrowedItem(memberId, bookId);
    return doc ? this.toMember(doc) : null;
  }

  async removeBorrowedItem(memberId: string, bookId: string): Promise<Member | null> {
    const doc = await this.memberRepository.removeBorrowedItem(memberId, bookId);
    return doc ? this.toMember(doc) : null;
  }
}

