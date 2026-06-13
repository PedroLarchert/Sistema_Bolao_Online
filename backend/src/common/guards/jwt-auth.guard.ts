import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'

type AuthenticatedRequest = Request & {
  user?: {
    sub: number
    login: string
    role: 'ADMIN' | 'USUARIO'
    name: string
  }
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
    const authorizationHeader = request.headers.authorization

    if (!authorizationHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Bearer token ausente')
    }

    const token = authorizationHeader.slice('Bearer '.length)
    const secret = this.configService.getOrThrow<string>('JWT_SECRET')

    try {
      request.user = (await this.jwtService.verifyAsync(token, { secret })) as {
        sub: number
        login: string
        role: 'ADMIN' | 'USUARIO'
        name: string
      }
      return true
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado')
    }
  }
}