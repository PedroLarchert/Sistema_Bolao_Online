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
exports.BetsService = void 0;
const common_1 = require("@nestjs/common");
const score_1 = require("../common/utils/score");
const competitions_service_1 = require("../competitions/competitions.service");
const matches_service_1 = require("../matches/matches.service");
const prisma_service_1 = require("../prisma/prisma.service");
let BetsService = class BetsService {
    prisma;
    competitionsService;
    matchesService;
    constructor(prisma, competitionsService, matchesService) {
        this.prisma = prisma;
        this.competitionsService = competitionsService;
        this.matchesService = matchesService;
    }
    async upsert(userId, userRole, matchId, dto) {
        const match = await this.matchesService.findById(matchId);
        await this.competitionsService.ensureVisibleToUser(match.competitionId, userId, userRole);
        if ((0, score_1.shouldLockBet)(match.matchDate, match.status)) {
            throw new common_1.BadRequestException('Não é possível criar ou editar palpite após o início da partida');
        }
        const bet = await this.prisma.bet.upsert({
            where: { userId_matchId: { userId, matchId } },
            update: { homeScore: dto.homeScore, awayScore: dto.awayScore },
            create: {
                userId,
                matchId,
                homeScore: dto.homeScore,
                awayScore: dto.awayScore,
            },
        });
        const matchTeams = new Set([match.homeTeamId, match.awayTeamId]);
        for (const playerGoal of dto.playerGoals) {
            const player = await this.prisma.player.findUnique({ where: { id: playerGoal.playerId } });
            if (!player || !matchTeams.has(player.teamId)) {
                throw new common_1.BadRequestException('Só é permitido selecionar jogadores dos times da partida');
            }
        }
        await this.prisma.betPlayerGoal.deleteMany({ where: { betId: bet.id } });
        if (dto.playerGoals.length > 0) {
            await this.prisma.betPlayerGoal.createMany({
                data: dto.playerGoals.map((playerGoal) => ({
                    betId: bet.id,
                    playerId: playerGoal.playerId,
                    goalsCount: playerGoal.goalsCount,
                })),
            });
        }
        return this.findOne(userId, matchId);
    }
    async findOne(userId, matchId) {
        return this.prisma.bet.findUnique({
            where: { userId_matchId: { userId, matchId } },
            include: { playerGoals: { include: { player: true } }, score: true, match: true },
        });
    }
    async findMineByCompetition(userId, competitionId, role) {
        await this.competitionsService.ensureVisibleToUser(competitionId, userId, role);
        return this.prisma.bet.findMany({
            where: { userId, match: { competitionId } },
            include: { playerGoals: { include: { player: true } }, score: true, match: { include: { homeTeam: true, awayTeam: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async remove(userId, matchId) {
        const bet = await this.findOne(userId, matchId);
        if (!bet) {
            throw new common_1.NotFoundException('Palpite não encontrado');
        }
        if ((0, score_1.shouldLockBet)(bet.match.matchDate, bet.match.status)) {
            throw new common_1.BadRequestException('Não é possível remover palpite após o início da partida');
        }
        await this.prisma.bet.delete({ where: { userId_matchId: { userId, matchId } } });
        return { deleted: true };
    }
    async recalculateBetScore(betId) {
        const bet = await this.prisma.bet.findUnique({
            where: { id: betId },
            include: {
                match: true,
                playerGoals: true,
                score: true,
            },
        });
        if (!bet || bet.match.homeScore === null || bet.match.awayScore === null) {
            return null;
        }
        const officialGoals = await this.prisma.officialGoal.findMany({ where: { matchId: bet.matchId } });
        const criterion = (0, score_1.computeCriterion)({ homeScore: bet.match.homeScore, awayScore: bet.match.awayScore, brazilGame: bet.match.brazilGame }, { homeScore: bet.homeScore, awayScore: bet.awayScore });
        const pointsResult = (0, score_1.computeResultPoints)(criterion, bet.match.brazilGame);
        const pointsPlayerGoals = (0, score_1.countPlayerGoalPoints)(bet.playerGoals, officialGoals);
        return this.prisma.betScore.upsert({
            where: { betId: bet.id },
            update: {
                pointsResult,
                pointsPlayerGoals,
                pointsTotal: pointsResult + pointsPlayerGoals,
                resultCriterion: criterion,
                brazilGame: bet.match.brazilGame,
                calculatedAt: new Date(),
            },
            create: {
                betId: bet.id,
                pointsResult,
                pointsPlayerGoals,
                pointsTotal: pointsResult + pointsPlayerGoals,
                resultCriterion: criterion,
                brazilGame: bet.match.brazilGame,
            },
        });
    }
};
exports.BetsService = BetsService;
exports.BetsService = BetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        competitions_service_1.CompetitionsService,
        matches_service_1.MatchesService])
], BetsService);
//# sourceMappingURL=bets.service.js.map