"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompetitionsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let CompetitionsService = class CompetitionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllForUser(userId, role) {
        if (role === client_1.UserRole.ADMIN) {
            const competitions = await this.prisma.competition.findMany({
                orderBy: { id: 'asc' },
                include: { _count: { select: { participants: true, matches: true } } },
            });
            return competitions.map((competition) => ({
                ...competition,
                myStanding: null,
                isParticipant: true,
            }));
        }
        const competitions = await this.prisma.competition.findMany({
            where: { participants: { some: { userId } } },
            orderBy: { id: 'asc' },
            include: {
                _count: { select: { participants: true, matches: true } },
                standings: { where: { userId }, take: 1 },
            },
        });
        return competitions.map((competition) => ({
            ...competition,
            myStanding: competition.standings[0] ?? null,
            isParticipant: true,
        }));
    }
    async findByIdForUser(competitionId, userId, role) {
        const competition = await this.prisma.competition.findUnique({
            where: { id: competitionId },
            include: {
                participants: { include: { user: true } },
                standings: { where: { userId }, take: 1 },
                _count: { select: { participants: true, matches: true } },
            },
        });
        if (!competition) {
            throw new common_1.NotFoundException('Competição não encontrada');
        }
        if (role !== client_1.UserRole.ADMIN) {
            const participant = competition.participants.some((participant) => participant.userId === userId);
            if (!participant) {
                throw new common_1.ForbiddenException('Você não participa dessa competição');
            }
        }
        return {
            ...competition,
            myStanding: competition.standings[0] ?? null,
            isParticipant: competition.participants.some((participant) => participant.userId === userId),
        };
    }
    async ensureVisibleToUser(competitionId, userId, role) {
        if (role === client_1.UserRole.ADMIN) {
            return this.findByIdForUser(competitionId, userId, role);
        }
        const participant = await this.prisma.userCompetition.findUnique({
            where: { userId_competitionId: { userId, competitionId } },
        });
        if (!participant) {
            throw new common_1.ForbiddenException('Você não participa dessa competição');
        }
        return this.findByIdForUser(competitionId, userId, role);
    }
    async create(dto, createdBy) {
        return this.prisma.competition.create({
            data: {
                name: dto.name,
                startDate: new Date(dto.startDate),
                status: 'ACTIVE',
            },
        });
    }
    async update(competitionId, dto) {
        await this.findByIdForUser(competitionId, 0, client_1.UserRole.ADMIN);
        return this.prisma.competition.update({
            where: { id: competitionId },
            data: {
                name: dto.name,
                startDate: dto.startDate ? new Date(dto.startDate) : undefined,
            },
        });
    }
    async remove(competitionId) {
        await this.findByIdForUser(competitionId, 0, client_1.UserRole.ADMIN);
        await this.prisma.competition.delete({ where: { id: competitionId } });
        return { deleted: true };
    }
    async join(competitionId, userId) {
        const competition = await this.prisma.competition.findUnique({ where: { id: competitionId } });
        if (!competition) {
            throw new common_1.NotFoundException('Competição não encontrada');
        }
        return this.prisma.userCompetition.upsert({
            where: { userId_competitionId: { userId, competitionId } },
            update: {},
            create: { userId, competitionId },
        });
    }
    async leave(competitionId, userId) {
        await this.prisma.userCompetition.delete({
            where: { userId_competitionId: { userId, competitionId } },
        });
        return { left: true };
    }
    async participants(competitionId) {
        return this.prisma.userCompetition.findMany({
            where: { competitionId },
            include: {
                user: {
                    select: { id: true, name: true, login: true, role: true },
                },
            },
            orderBy: { joinedAt: 'asc' },
        });
    }
    async addParticipant(competitionId, userId) {
        const competition = await this.prisma.competition.findUnique({ where: { id: competitionId } });
        if (!competition) {
            throw new common_1.NotFoundException('Competição não encontrada');
        }
        return this.prisma.userCompetition.upsert({
            where: { userId_competitionId: { userId, competitionId } },
            update: {},
            create: { userId, competitionId },
            include: {
                user: {
                    select: { id: true, name: true, login: true, role: true },
                },
            },
        });
    }
    async removeParticipant(competitionId, userId) {
        await this.prisma.userCompetition.delete({
            where: { userId_competitionId: { userId, competitionId } },
        });
        return { deleted: true };
    }
};
exports.CompetitionsService = CompetitionsService;
exports.CompetitionsService = CompetitionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompetitionsService);
//# sourceMappingURL=competitions.service.js.map