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
exports.RankingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const competitions_service_1 = require("../competitions/competitions.service");
const client_1 = require("@prisma/client");
let RankingService = class RankingService {
    prisma;
    competitionsService;
    constructor(prisma, competitionsService) {
        this.prisma = prisma;
        this.competitionsService = competitionsService;
    }
    async getRanking(competitionId, userId, role) {
        await this.competitionsService.ensureVisibleToUser(competitionId, userId, role);
        return this.prisma.competitionStanding.findMany({
            where: { competitionId },
            include: {
                user: { select: { id: true, name: true, login: true, role: true } },
            },
            orderBy: [{ totalPoints: 'desc' }, { exactScoreCount: 'desc' }, { goalDiffCount: 'desc' }],
        });
    }
    async getDetails(competitionId, targetUserId, currentUserId, role) {
        if (role !== client_1.UserRole.ADMIN && currentUserId !== targetUserId) {
            await this.competitionsService.ensureVisibleToUser(competitionId, currentUserId, role);
        }
        return this.prisma.bet.findMany({
            where: { userId: targetUserId, match: { competitionId } },
            include: {
                match: { include: { homeTeam: true, awayTeam: true } },
                score: true,
                playerGoals: { include: { player: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.RankingService = RankingService;
exports.RankingService = RankingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        competitions_service_1.CompetitionsService])
], RankingService);
//# sourceMappingURL=ranking.service.js.map