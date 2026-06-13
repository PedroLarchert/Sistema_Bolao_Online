import { Injectable, NotFoundException } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { BetsService } from '../bets/bets.service'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ScoringService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly betsService: BetsService,
  ) {}

  async recalculateCompetition(competitionId: number) {
    const competition = await this.prisma.competition.findUnique({ where: { id: competitionId } })
    if (!competition) {
      throw new NotFoundException('Competição não encontrada')
    }

    const bets = await this.prisma.bet.findMany({
      where: { match: { competitionId } },
      select: { id: true, userId: true },
    })

    const scoreByUser = new Map<number, { points: number; bets: number; exact: number; diff: number; winner: number }>()

    for (const bet of bets) {
      const betScore = await this.betsService.recalculateBetScore(bet.id)
      if (!betScore) {
        continue
      }

      const bucket = scoreByUser.get(bet.userId) ?? { points: 0, bets: 0, exact: 0, diff: 0, winner: 0 }
      bucket.points += betScore.pointsTotal
      bucket.bets += 1
      if (betScore.resultCriterion === 'PLACAR_EXATO') {
        bucket.exact += 1
      } else if (betScore.resultCriterion === 'DIFERENCA_GOLS') {
        bucket.diff += 1
      } else if (betScore.resultCriterion === 'VENCEDOR') {
        bucket.winner += 1
      }
      scoreByUser.set(bet.userId, bucket)
    }

    await this.prisma.$transaction(
      Array.from(scoreByUser.entries()).map(([userId, stats]) =>
        this.prisma.competitionStanding.upsert({
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
        }),
      ),
    )

    return { competitionId, recalculatedUsers: scoreByUser.size }
  }
}