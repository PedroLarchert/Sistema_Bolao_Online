import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { MatchStatus, UserRole } from '@prisma/client'
import { countPlayerGoalPoints, computeCriterion, computeResultPoints, shouldLockBet } from '../common/utils/score'
import { CompetitionsService } from '../competitions/competitions.service'
import { MatchesService } from '../matches/matches.service'
import { PrismaService } from '../prisma/prisma.service'
import { UpsertBetDto } from './dto/upsert-bet.dto'

@Injectable()
export class BetsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly competitionsService: CompetitionsService,
    private readonly matchesService: MatchesService,
  ) {}

  async upsert(userId: number, userRole: UserRole, matchId: number, dto: UpsertBetDto) {
    const match = await this.matchesService.findById(matchId)
    await this.competitionsService.ensureVisibleToUser(match.competitionId, userId, userRole)

    if (shouldLockBet(match.matchDate, match.status)) {
      throw new BadRequestException('Não é possível criar ou editar palpite após o início da partida')
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
    })

    const matchTeams = new Set([match.homeTeamId, match.awayTeamId])
    for (const playerGoal of dto.playerGoals) {
      const player = await this.prisma.player.findUnique({ where: { id: playerGoal.playerId } })
      if (!player || !matchTeams.has(player.teamId)) {
        throw new BadRequestException('Só é permitido selecionar jogadores dos times da partida')
      }
    }

    await this.prisma.betPlayerGoal.deleteMany({ where: { betId: bet.id } })
    if (dto.playerGoals.length > 0) {
      await this.prisma.betPlayerGoal.createMany({
        data: dto.playerGoals.map((playerGoal) => ({
          betId: bet.id,
          playerId: playerGoal.playerId,
          goalsCount: playerGoal.goalsCount,
        })),
      })
    }

    return this.findOne(userId, matchId)
  }

  async findOne(userId: number, matchId: number) {
    return this.prisma.bet.findUnique({
      where: { userId_matchId: { userId, matchId } },
      include: { playerGoals: { include: { player: true } }, score: true, match: true },
    })
  }

  async findMineByCompetition(userId: number, competitionId: number, role: UserRole) {
    await this.competitionsService.ensureVisibleToUser(competitionId, userId, role)
    return this.prisma.bet.findMany({
      where: { userId, match: { competitionId } },
      include: { playerGoals: { include: { player: true } }, score: true, match: { include: { homeTeam: true, awayTeam: true } } },
      orderBy: { createdAt: 'desc' },
    })
  }

  async remove(userId: number, matchId: number) {
    const bet = await this.findOne(userId, matchId)
    if (!bet) {
      throw new NotFoundException('Palpite não encontrado')
    }

    if (shouldLockBet(bet.match.matchDate, bet.match.status)) {
      throw new BadRequestException('Não é possível remover palpite após o início da partida')
    }

    await this.prisma.bet.delete({ where: { userId_matchId: { userId, matchId } } })
    return { deleted: true }
  }

  async recalculateBetScore(betId: number) {
    const bet = await this.prisma.bet.findUnique({
      where: { id: betId },
      include: {
        match: true,
        playerGoals: true,
        score: true,
      },
    })

    if (!bet || bet.match.homeScore === null || bet.match.awayScore === null) {
      return null
    }

    const officialGoals = await this.prisma.officialGoal.findMany({ where: { matchId: bet.matchId } })
    const criterion = computeCriterion(
      { homeScore: bet.match.homeScore, awayScore: bet.match.awayScore, brazilGame: bet.match.brazilGame },
      { homeScore: bet.homeScore, awayScore: bet.awayScore },
    )
    const pointsResult = computeResultPoints(criterion, bet.match.brazilGame)
    const pointsPlayerGoals = countPlayerGoalPoints(bet.playerGoals, officialGoals)

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
    })
  }
}