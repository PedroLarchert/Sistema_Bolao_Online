import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { MatchStatus } from '@prisma/client'
import { MatchesService } from '../matches/matches.service'
import { PrismaService } from '../prisma/prisma.service'
import { ReplaceOfficialGoalsDto } from './dto/replace-official-goals.dto'

@Injectable()
export class GoalsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly matchesService: MatchesService,
  ) {}

  async replace(matchId: number, dto: ReplaceOfficialGoalsDto) {
    const match = await this.matchesService.findById(matchId)

    if (match.homeScore === null || match.awayScore === null || match.status !== MatchStatus.FINISHED) {
      throw new BadRequestException('Defina o placar oficial da partida antes de registrar os gols')
    }

    const allowedTeamIds = new Set([match.homeTeamId, match.awayTeamId])
    for (const goal of dto.goals) {
      const player = await this.prisma.player.findUnique({ where: { id: goal.playerId } })
      if (!player || !allowedTeamIds.has(player.teamId)) {
        throw new BadRequestException('Somente jogadores dos times da partida podem receber gols oficiais')
      }
    }

    await this.prisma.officialGoal.deleteMany({ where: { matchId } })
    if (dto.goals.length > 0) {
      await this.prisma.officialGoal.createMany({
        data: dto.goals.map((goal) => ({
          matchId,
          playerId: goal.playerId,
          goalsCount: goal.goalsCount,
        })),
      })
    }

    return this.list(matchId)
  }

  list(matchId: number) {
    return this.prisma.officialGoal.findMany({
      where: { matchId },
      include: { player: { include: { team: true } } },
      orderBy: [{ playerId: 'asc' }],
    })
  }

  async getOne(matchId: number) {
    const match = await this.matchesService.findById(matchId)
    if (!match) {
      throw new NotFoundException('Partida não encontrada')
    }
    return this.list(matchId)
  }
}