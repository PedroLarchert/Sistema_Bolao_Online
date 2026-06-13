import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreatePlayerDto } from './dto/create-player.dto'
import { UpdatePlayerDto } from './dto/update-player.dto'

@Injectable()
export class PlayersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(teamId?: number) {
    return this.prisma.player.findMany({
      where: teamId ? { teamId } : undefined,
      orderBy: { id: 'asc' },
      include: { team: true },
    })
  }

  async findByIdOrFail(playerId: number) {
    const player = await this.prisma.player.findUnique({ where: { id: playerId } })
    if (!player) {
      throw new NotFoundException('Jogador não encontrado')
    }
    return player
  }

  create(dto: CreatePlayerDto) {
    return this.prisma.player.create({ data: { name: dto.name, teamId: dto.teamId } })
  }

  async update(playerId: number, dto: UpdatePlayerDto) {
    await this.findByIdOrFail(playerId)
    return this.prisma.player.update({ where: { id: playerId }, data: { name: dto.name, teamId: dto.teamId } })
  }

  async remove(playerId: number) {
    await this.findByIdOrFail(playerId)
    await this.prisma.player.delete({ where: { id: playerId } })
    return { deleted: true }
  }
}