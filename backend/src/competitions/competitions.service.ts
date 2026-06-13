import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { Prisma, UserRole } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { CreateCompetitionDto } from './dto/create-competition.dto'
import { UpdateCompetitionDto } from './dto/update-competition.dto'

@Injectable()
export class CompetitionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForUser(userId: number, role: UserRole) {
    if (role === UserRole.ADMIN) {
      const competitions = await this.prisma.competition.findMany({
        orderBy: { id: 'asc' },
        include: { _count: { select: { participants: true, matches: true } } },
      })

      return competitions.map((competition) => ({
        ...competition,
        myStanding: null,
        isParticipant: true,
      }))
    }

    const competitions = await this.prisma.competition.findMany({
      where: { participants: { some: { userId } } },
      orderBy: { id: 'asc' },
      include: {
        _count: { select: { participants: true, matches: true } },
        standings: { where: { userId }, take: 1 },
      },
    })

    return competitions.map((competition) => ({
      ...competition,
      myStanding: competition.standings[0] ?? null,
      isParticipant: true,
    }))
  }

  async findByIdForUser(competitionId: number, userId: number, role: UserRole) {
    const competition = await this.prisma.competition.findUnique({
      where: { id: competitionId },
      include: {
        participants: { include: { user: true } },
        standings: { where: { userId }, take: 1 },
        _count: { select: { participants: true, matches: true } },
      },
    })

    if (!competition) {
      throw new NotFoundException('Competição não encontrada')
    }

    if (role !== UserRole.ADMIN) {
      const participant = competition.participants.some((participant) => participant.userId === userId)
      if (!participant) {
        throw new ForbiddenException('Você não participa dessa competição')
      }
    }

    return {
      ...competition,
      myStanding: competition.standings[0] ?? null,
      isParticipant:
        role === UserRole.ADMIN || competition.participants.some((participant) => participant.userId === userId),
    }
  }

  async ensureVisibleToUser(competitionId: number, userId: number, role: UserRole) {
    if (role === UserRole.ADMIN) {
      return this.findByIdForUser(competitionId, userId, role)
    }

    const participant = await this.prisma.userCompetition.findUnique({
      where: { userId_competitionId: { userId, competitionId } },
    })

    if (!participant) {
      throw new ForbiddenException('Você não participa dessa competição')
    }

    return this.findByIdForUser(competitionId, userId, role)
  }

  async create(dto: CreateCompetitionDto, createdBy: number) {
    return this.prisma.competition.create({
      data: {
        name: dto.name,
        startDate: new Date(dto.startDate),
        status: 'ACTIVE',
      },
    })
  }

  async update(competitionId: number, dto: UpdateCompetitionDto) {
    await this.findByIdForUser(competitionId, 0, UserRole.ADMIN)

    return this.prisma.competition.update({
      where: { id: competitionId },
      data: {
        name: dto.name,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      },
    })
  }

  async remove(competitionId: number) {
    await this.findByIdForUser(competitionId, 0, UserRole.ADMIN)
    await this.prisma.competition.delete({ where: { id: competitionId } })
    return { deleted: true }
  }

  async join(competitionId: number, userId: number) {
    const competition = await this.prisma.competition.findUnique({ where: { id: competitionId } })
    if (!competition) {
      throw new NotFoundException('Competição não encontrada')
    }

    return this.prisma.userCompetition.upsert({
      where: { userId_competitionId: { userId, competitionId } },
      update: {},
      create: { userId, competitionId },
    })
  }

  async leave(competitionId: number, userId: number) {
    await this.prisma.userCompetition.delete({
      where: { userId_competitionId: { userId, competitionId } },
    })
    return { left: true }
  }

  async participants(competitionId: number) {
    return this.prisma.userCompetition.findMany({
      where: { competitionId },
      include: {
        user: {
          select: { id: true, name: true, login: true, role: true },
        },
      },
      orderBy: { joinedAt: 'asc' },
    })
  }

  async addParticipant(competitionId: number, userId: number) {
    const competition = await this.prisma.competition.findUnique({ where: { id: competitionId } })
    if (!competition) {
      throw new NotFoundException('Competição não encontrada')
    }
    return this.prisma.userCompetition.upsert({
      where: { userId_competitionId: { userId, competitionId } },
      update: {},
      create: { userId, competitionId },
      include: {
        user: {
          select: { id: true, name: true, login: true, role: true },
        },
      },
    })
  }

  async removeParticipant(competitionId: number, userId: number) {
    await this.prisma.userCompetition.delete({
      where: { userId_competitionId: { userId, competitionId } },
    })

    return { deleted: true }
  }
}