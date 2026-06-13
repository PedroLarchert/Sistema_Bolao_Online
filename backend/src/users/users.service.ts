import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAllPublic() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        login: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { id: 'asc' },
    })
  }

  findPublicById(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        login: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  async findByIdOrFail(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new NotFoundException('Usuário não encontrado')
    }
    return user
  }

  async create(dto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({ where: { login: dto.login } })
    if (existingUser) {
      throw new ConflictException('Login já está em uso')
    }

    const passwordHash = await bcrypt.hash(dto.password, 12)
    return this.prisma.user.create({
      data: {
        name: dto.name,
        login: dto.login,
        passwordHash,
        role: dto.role,
      },
      select: {
        id: true,
        name: true,
        login: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  async update(userId: number, dto: UpdateUserDto) {
    await this.findByIdOrFail(userId)

    if (dto.login) {
      const existingUser = await this.prisma.user.findFirst({
        where: { login: dto.login, NOT: { id: userId } },
      })

      if (existingUser) {
        throw new ConflictException('Login já está em uso')
      }
    }

    const passwordHash = dto.password ? await bcrypt.hash(dto.password, 12) : undefined

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name,
        login: dto.login,
        passwordHash,
        role: dto.role,
      },
      select: {
        id: true,
        name: true,
        login: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  async remove(userId: number) {
    await this.findByIdOrFail(userId)
    await this.prisma.user.delete({ where: { id: userId } })
    return { deleted: true }
  }
}