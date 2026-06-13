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
exports.MatchesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const competitions_service_1 = require("../competitions/competitions.service");
const prisma_service_1 = require("../prisma/prisma.service");
let MatchesService = class MatchesService {
    prisma;
    competitionsService;
    constructor(prisma, competitionsService) {
        this.prisma = prisma;
        this.competitionsService = competitionsService;
    }
    async findVisible(competitionId, userId, role) {
        if (competitionId) {
            await this.competitionsService.ensureVisibleToUser(competitionId, userId, role);
            const matches = await this.prisma.match.findMany({
                where: { competitionId },
                orderBy: { matchDate: 'asc' },
                include: {
                    homeTeam: { include: { players: true } },
                    awayTeam: { include: { players: true } },
                    bets: {
                        where: { userId },
                        include: { playerGoals: { include: { player: true } }, score: true },
                        take: 1,
                    },
                },
            });
            return matches.map((match) => ({
                ...match,
                userBet: match.bets[0] ?? null,
            }));
        }
        if (role === client_1.UserRole.ADMIN) {
            const matches = await this.prisma.match.findMany({
                orderBy: { matchDate: 'asc' },
                include: {
                    homeTeam: { include: { players: true } },
                    awayTeam: { include: { players: true } },
                    competition: true,
                    bets: { where: { userId }, take: 1 },
                },
            });
            return matches.map((match) => ({
                ...match,
                userBet: match.bets[0] ?? null,
            }));
        }
        const matches = await this.prisma.match.findMany({
            where: { competition: { participants: { some: { userId } } } },
            orderBy: { matchDate: 'asc' },
            include: {
                homeTeam: { include: { players: true } },
                awayTeam: { include: { players: true } },
                competition: true,
                bets: { where: { userId }, include: { playerGoals: { include: { player: true } }, score: true }, take: 1 },
            },
        });
        return matches.map((match) => ({
            ...match,
            userBet: match.bets[0] ?? null,
        }));
    }
    async findById(matchId) {
        const match = await this.prisma.match.findUnique({
            where: { id: matchId },
            include: { homeTeam: true, awayTeam: true, competition: true },
        });
        if (!match) {
            throw new common_1.NotFoundException('Partida não encontrada');
        }
        return match;
    }
    async create(dto) {
        if (dto.homeTeamId === dto.awayTeamId) {
            throw new common_1.BadRequestException('Não é permitido o mesmo time nos dois lados da partida');
        }
        return this.prisma.match.create({
            data: {
                competitionId: dto.competitionId,
                homeTeamId: dto.homeTeamId,
                awayTeamId: dto.awayTeamId,
                matchDate: new Date(dto.matchDate),
                brazilGame: dto.brazilGame,
            },
        });
    }
    async update(matchId, dto) {
        const match = await this.findById(matchId);
        if (dto.homeTeamId && dto.awayTeamId && dto.homeTeamId === dto.awayTeamId) {
            throw new common_1.BadRequestException('Não é permitido o mesmo time nos dois lados da partida');
        }
        return this.prisma.match.update({
            where: { id: matchId },
            data: {
                competitionId: dto.competitionId,
                homeTeamId: dto.homeTeamId,
                awayTeamId: dto.awayTeamId,
                matchDate: dto.matchDate ? new Date(dto.matchDate) : undefined,
                brazilGame: dto.brazilGame,
                status: dto.matchDate && new Date(dto.matchDate).getTime() <= Date.now() ? client_1.MatchStatus.LIVE : match.status,
            },
        });
    }
    async remove(matchId) {
        await this.findById(matchId);
        await this.prisma.match.delete({ where: { id: matchId } });
        return { deleted: true };
    }
    async updateScore(matchId, dto) {
        if (dto.homeScore < 0 || dto.awayScore < 0) {
            throw new common_1.BadRequestException('Placar não pode ser negativo');
        }
        return this.prisma.match.update({
            where: { id: matchId },
            data: {
                homeScore: dto.homeScore,
                awayScore: dto.awayScore,
                status: client_1.MatchStatus.FINISHED,
            },
        });
    }
};
exports.MatchesService = MatchesService;
exports.MatchesService = MatchesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        competitions_service_1.CompetitionsService])
], MatchesService);
//# sourceMappingURL=matches.service.js.map