import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CompetitionsService } from '../competitions/competitions.service'
import { UserRole } from '@prisma/client'

@Injectable()
export class RankingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly competitionsService: CompetitionsService,
  ) {}

  async getRanking(competitionId: number, userId: number, role: UserRole) {
    await this.competitionsService.ensureVisibleToUser(competitionId, userId, role)

    return this.prisma.competitionStanding.findMany({
      where: { competitionId },
      include: {
        user: { select: { id: true, name: true, login: true, role: true } },
      },
      orderBy: [{ totalPoints: 'desc' }, { exactScoreCount: 'desc' }, { goalDiffCount: 'desc' }],
    })
  }

  async getDetails(competitionId: number, targetUserId: number, currentUserId: number, role: UserRole) {
    if (role !== UserRole.ADMIN && currentUserId !== targetUserId) {
      await this.competitionsService.ensureVisibleToUser(competitionId, currentUserId, role)
    }

    return this.prisma.bet.findMany({
      where: { userId: targetUserId, match: { competitionId } },
      include: {
        match: { include: { homeTeam: true, awayTeam: true } },
        score: true,
        playerGoals: { include: { player: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  }
}