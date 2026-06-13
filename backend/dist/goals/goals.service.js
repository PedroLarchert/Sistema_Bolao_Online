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
exports.GoalsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const matches_service_1 = require("../matches/matches.service");
const prisma_service_1 = require("../prisma/prisma.service");
let GoalsService = class GoalsService {
    prisma;
    matchesService;
    constructor(prisma, matchesService) {
        this.prisma = prisma;
        this.matchesService = matchesService;
    }
    async replace(matchId, dto) {
        const match = await this.matchesService.findById(matchId);
        if (match.homeScore === null || match.awayScore === null || match.status !== client_1.MatchStatus.FINISHED) {
            throw new common_1.BadRequestException('Defina o placar oficial da partida antes de registrar os gols');
        }
        const allowedTeamIds = new Set([match.homeTeamId, match.awayTeamId]);
        for (const goal of dto.goals) {
            const player = await this.prisma.player.findUnique({ where: { id: goal.playerId } });
            if (!player || !allowedTeamIds.has(player.teamId)) {
                throw new common_1.BadRequestException('Somente jogadores dos times da partida podem receber gols oficiais');
            }
        }
        await this.prisma.officialGoal.deleteMany({ where: { matchId } });
        if (dto.goals.length > 0) {
            await this.prisma.officialGoal.createMany({
                data: dto.goals.map((goal) => ({
                    matchId,
                    playerId: goal.playerId,
                    goalsCount: goal.goalsCount,
                })),
            });
        }
        return this.list(matchId);
    }
    list(matchId) {
        return this.prisma.officialGoal.findMany({
            where: { matchId },
            include: { player: { include: { team: true } } },
            orderBy: [{ playerId: 'asc' }],
        });
    }
    async getOne(matchId) {
        const match = await this.matchesService.findById(matchId);
        if (!match) {
            throw new common_1.NotFoundException('Partida não encontrada');
        }
        return this.list(matchId);
    }
};
exports.GoalsService = GoalsService;
exports.GoalsService = GoalsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        matches_service_1.MatchesService])
], GoalsService);
//# sourceMappingURL=goals.service.js.map