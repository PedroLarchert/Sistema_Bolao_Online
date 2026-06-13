import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

type RequestWithUser = Request & {
  user?: {
    sub: number
    login: string
    role: 'ADMIN' | 'USUARIO'
    name: string
  }
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Current authenticated user',
    schema: {
      example: {
        sub: 1,
        login: 'admin',
        role: 'ADMIN',
        name: 'Administrador',
      },
    },
  })
  me(@Req() request: RequestWithUser) {
    return request.user
  }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and return JWT' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'JWT login response',
    schema: {
      example: {
        accessToken: 'eyJhbGciOi...',
        user: {
          id: 1,
          name: 'Administrador',
          login: 'admin',
          role: 'ADMIN',
        },
      },
    },
  })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new USUARIO account' })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({
    description: 'Registered user',
    schema: {
      example: {
        id: 2,
        name: 'Maria',
        login: 'maria',
        role: 'USUARIO',
        accessToken: 'eyJhbGciOi...',
      },
    },
  })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }
}