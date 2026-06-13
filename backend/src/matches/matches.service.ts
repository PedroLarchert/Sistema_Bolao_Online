import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { MatchStatus, UserRole } from '@prisma/client'
import { CompetitionsService } from '../competitions/competitions.service'
import { PrismaService } from '../prisma/prisma.service'
import { CreateMatchDto } from './dto/create-match.dto'
import { UpdateMatchDto } from './dto/update-match.dto'
import { UpdateScoreDto } from './dto/update-score.dto'

@Injectable()
export class MatchesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly competitionsService: CompetitionsService,
  ) {}

  async findVisible(competitionId: number | undefined, userId: number, role: UserRole) {
    if (competitionId) {
      await this.competitionsService.ensureVisibleToUser(competitionId, userId, role)
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
      })

      return matches.map((match) => ({
        ...match,
        userBet: match.bets[0] ?? null,
      }))
    }

    if (role === UserRole.ADMIN) {
      const matches = await this.prisma.match.findMany({
        orderBy: { matchDate: 'asc' },
        include: {
          homeTeam: { include: { players: true } },
          awayTeam: { include: { players: true } },
          competition: true,
          bets: { where: { userId }, take: 1 },
        },
      })

      return matches.map((match) => ({
        ...match,
        userBet: match.bets[0] ?? null,
      }))
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
    })

    return matches.map((match) => ({
      ...match,
      userBet: match.bets[0] ?? null,
    }))
  }

  async findById(matchId: number) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
      include: { homeTeam: true, awayTeam: true, competition: true },
    })

    if (!match) {
      throw new NotFoundException('Partida não encontrada')
    }

    return match
  }

  async create(dto: CreateMatchDto) {
    if (dto.homeTeamId === dto.awayTeamId) {
      throw new BadRequestException('Não é permitido o mesmo time nos dois lados da partida')
    }

    return this.prisma.match.create({
      data: {
        competitionId: dto.competitionId,
        homeTeamId: dto.homeTeamId,
        awayTeamId: dto.awayTeamId,
        matchDate: new Date(dto.matchDate),
        brazilGame: dto.brazilGame,
      },
    })
  }

  async update(matchId: number, dto: UpdateMatchDto) {
    const match = await this.findById(matchId)
    if (dto.homeTeamId && dto.awayTeamId && dto.homeTeamId === dto.awayTeamId) {
      throw new BadRequestException('Não é permitido o mesmo time nos dois lados da partida')
    }

    return this.prisma.match.update({
      where: { id: matchId },
      data: {
        competitionId: dto.competitionId,
        homeTeamId: dto.homeTeamId,
        awayTeamId: dto.awayTeamId,
        matchDate: dto.matchDate ? new Date(dto.matchDate) : undefined,
        brazilGame: dto.brazilGame,
        status: dto.matchDate && new Date(dto.matchDate).getTime() <= Date.now() ? MatchStatus.LIVE : match.status,
      },
    })
  }

  async remove(matchId: number) {
    await this.findById(matchId)
    await this.prisma.match.delete({ where: { id: matchId } })
    return { deleted: true }
  }

  async updateScore(matchId: number, dto: UpdateScoreDto) {
    if (dto.homeScore < 0 || dto.awayScore < 0) {
      throw new BadRequestException('Placar não pode ser negativo')
    }

    return this.prisma.match.update({
      where: { id: matchId },
      data: {
        homeScore: dto.homeScore,
        awayScore: dto.awayScore,
        status: MatchStatus.FINISHED,
      },
    })
  }
}