import { Request, Response } from 'express';
import MemberService from '../catalog-service/src/services/memberService';

export class MemberController {
  private memberService: any;

  constructor() {
    this.memberService = new MemberService();
  }

  createMember = async (req: Request, res: Response): Promise<void> => {
    try {
      const member = await this.memberService.createMember(req.body);
      res.status(201).json({
        success: true,
        data: member,
        message: 'Member created successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to create member'
      });
    }
  };

  getAllMembers = async (req: Request, res: Response): Promise<void> => {
    try {
      const members = await this.memberService.getAllMembers();
      res.json({
        success: true,
        data: members,
        count: members.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch members'
      });
    }
  };

  getMemberById = async (req: Request, res: Response): Promise<void> => {
    try {
      const member = await this.memberService.getMemberById(req.params.id);
      if (!member) {
        res.status(404).json({ error: 'Member not found' });
        return;
      }
      res.json(member);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getMemberByStudentId = async (req: Request, res: Response): Promise<void> => {
    try {
      const member = await this.memberService.getMemberByStudentId(req.params.studentId);
      if (!member) {
        res.status(404).json({ error: 'Member not found' });
        return;
      }
      res.json(member);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  updateMember = async (req: Request, res: Response): Promise<void> => {
    try {
      const member = await this.memberService.updateMember(req.params.id, req.body);
      if (!member) {
        res.status(404).json({ error: 'Member not found' });
        return;
      }
      res.json(member);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  deleteMember = async (req: Request, res: Response): Promise<void> => {
    try {
      const deleted = await this.memberService.deleteMember(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: 'Member not found' });
        return;
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}

