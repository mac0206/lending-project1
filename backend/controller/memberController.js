"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberController = void 0;
const memberService_1 = __importDefault(require("../catalog-service/src/services/memberService"));
class MemberController {
    constructor() {
        this.createMember = async (req, res) => {
            try {
                const member = await this.memberService.createMember(req.body);
                res.status(201).json({
                    success: true,
                    data: member,
                    message: 'Member created successfully'
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    error: error.message || 'Failed to create member'
                });
            }
        };
        this.getAllMembers = async (req, res) => {
            try {
                const members = await this.memberService.getAllMembers();
                res.json({
                    success: true,
                    data: members,
                    count: members.length
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message || 'Failed to fetch members'
                });
            }
        };
        this.getMemberById = async (req, res) => {
            try {
                const member = await this.memberService.getMemberById(req.params.id);
                if (!member) {
                    res.status(404).json({ error: 'Member not found' });
                    return;
                }
                res.json(member);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
        this.getMemberByStudentId = async (req, res) => {
            try {
                const member = await this.memberService.getMemberByStudentId(req.params.studentId);
                if (!member) {
                    res.status(404).json({ error: 'Member not found' });
                    return;
                }
                res.json(member);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
        this.updateMember = async (req, res) => {
            try {
                const member = await this.memberService.updateMember(req.params.id, req.body);
                if (!member) {
                    res.status(404).json({ error: 'Member not found' });
                    return;
                }
                res.json(member);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
        this.deleteMember = async (req, res) => {
            try {
                const deleted = await this.memberService.deleteMember(req.params.id);
                if (!deleted) {
                    res.status(404).json({ error: 'Member not found' });
                    return;
                }
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
        this.memberService = new memberService_1.default();
    }
}
exports.MemberController = MemberController;
