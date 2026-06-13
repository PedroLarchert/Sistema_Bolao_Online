import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateTeamDto } from './dto/create-team.dto'
import { UpdateTeamDto } from './dto/update-team.dto'

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.team.findMany({ orderBy: { id: 'asc' } })
  }

  async findByIdOrFail(teamId: number) {
    const team = await this.prisma.team.findUnique({ where: { id: teamId } })
    if (!team) {
      throw new NotFoundException('Time não encontrado')
    }
    return team
  }

  async create(dto: CreateTeamDto) {
    return this.prisma.team.create({ data: { name: dto.name } })
  }

  async update(teamId: number, dto: UpdateTeamDto) {
    await this.findByIdOrFail(teamId)
    return this.prisma.team.update({ where: { id: teamId }, data: { name: dto.name } })
  }

  async remove(teamId: number) {
    await this.findByIdOrFail(teamId)
    await this.prisma.team.delete({ where: { id: teamId } })
    return { deleted: true }
  }
}