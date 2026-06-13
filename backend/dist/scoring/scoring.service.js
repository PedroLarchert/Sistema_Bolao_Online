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
exports.ScoringService = void 0;
const common_1 = require("@nestjs/common");
const bets_service_1 = require("../bets/bets.service");
const prisma_service_1 = require("../prisma/prisma.service");
let ScoringService = class ScoringService {
    prisma;
    betsService;
    constructor(prisma, betsService) {
        this.prisma = prisma;
        this.betsService = betsService;
    }
    async recalculateCompetition(competitionId) {
        const competition = await this.prisma.competition.findUnique({ where: { id: competitionId } });
        if (!competition) {
            throw new common_1.NotFoundException('Competição não encontrada');
        }
        const bets = await this.prisma.bet.findMany({
            where: { match: { competitionId } },
            select: { id: true, userId: true },
        });
        const scoreByUser = new Map();
        for (const bet of bets) {
            const betScore = await this.betsService.recalculateBetScore(bet.id);
            if (!betScore) {
                continue;
            }
            const bucket = scoreByUser.get(bet.userId) ?? { points: 0, bets: 0, exact: 0, diff: 0, winner: 0 };
            bucket.points += betScore.pointsTotal;
            bucket.bets += 1;
            if (betScore.resultCriterion === 'PLACAR_EXATO') {
                bucket.exact += 1;
            }
            else if (betScore.resultCriterion === 'DIFERENCA_GOLS') {
                bucket.diff += 1;
            }
            else if (betScore.resultCriterion === 'VENCEDOR') {
                bucket.winner += 1;
            }
            scoreByUser.set(bet.userId, bucket);
        }
        await this.prisma.$transaction(Array.from(scoreByUser.entries()).map(([userId, stats]) => this.prisma.competitionStanding.upsert({
            where: { userId_competitionId: { userId, competitionId } },
            update: {
                totalPoints: stats.points,
                betsCount: stats.bets,
                exactScoreCount: stats.exact,
                goalDiffCount: stats.diff,
                winnerCount: stats.winner,
            },
            create: {
                userId,
                competitionId,
                totalPoints: stats.points,
                betsCount: stats.bets,
                exactScoreCount: stats.exact,
                goalDiffCount: stats.diff,
                winnerCount: stats.winner,
            },
        })));
        return { competitionId, recalculatedUsers: scoreByUser.size };
    }
};
exports.ScoringService = ScoringService;
exports.ScoringService = ScoringService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        bets_service_1.BetsService])
], ScoringService);
//# sourceMappingURL=scoring.service.js.map