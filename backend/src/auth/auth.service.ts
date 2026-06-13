import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UserRole } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { login: dto.login },
    })

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas')
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas')
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      login: user.login,
      role: user.role,
      name: user.name,
    })

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        login: user.login,
        role: user.role,
      },
    }
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({ where: { login: dto.login } })

    if (existingUser) {
      throw new ConflictException('Login já está em uso')
    }

    const passwordHash = await bcrypt.hash(dto.password, 12)
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        login: dto.login,
        passwordHash,
        role: UserRole.USUARIO,
      },
    })

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      login: user.login,
      role: user.role,
      name: user.name,
    })

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        login: user.login,
        role: user.role,
      },
    }
  }
}