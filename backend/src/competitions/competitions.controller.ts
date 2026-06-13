import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { Roles } from '../common/decorators/roles.decorator'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { CreateCompetitionDto } from './dto/create-competition.dto'
import { UpdateCompetitionDto } from './dto/update-competition.dto'
import { CompetitionsService } from './competitions.service'

@ApiTags('competitions')
@ApiBearerAuth()
@Controller('competitions')
export class CompetitionsController {
  constructor(private readonly competitionsService: CompetitionsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List competitions visible to the current user' })
  @ApiOkResponse({
    description: 'Visible competitions',
    schema: {
      example: [
        {
          id: 1,
          name: 'Copa do Mundo 2026',
          startDate: '2026-06-01T00:00:00.000Z',
          status: 'ACTIVE',
          myStanding: {
            totalPoints: 25,
            betsCount: 3,
          },
          isParticipant: true,
        },
      ],
    },
  })
  async findAll(@CurrentUser() user: { sub: number; role: 'ADMIN' | 'USUARIO' }) {
    return this.competitionsService.findAllForUser(user.sub, user.role)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get competition details visible to the current user' })
  async findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { sub: number; role: 'ADMIN' | 'USUARIO' }) {
    return this.competitionsService.ensureVisibleToUser(id, user.sub, user.role)
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create competition' })
  @ApiCreatedResponse({ description: 'Competition created' })
  async create(@Body() dto: CreateCompetitionDto, @CurrentUser() user: { sub: number }) {
    return this.competitionsService.create(dto, user.sub)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCompetitionDto) {
    return this.competitionsService.update(id, dto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.competitionsService.remove(id)
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  async join(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { sub: number }) {
    return this.competitionsService.join(id, user.sub)
  }

  @Delete(':id/leave')
  @UseGuards(JwtAuthGuard)
  async leave(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { sub: number }) {
    return this.competitionsService.leave(id, user.sub)
  }

  @Get(':id/participants')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async participants(@Param('id', ParseIntPipe) id: number) {
    return this.competitionsService.participants(id)
  }

  @Post(':id/participants/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async addParticipant(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.competitionsService.addParticipant(id, userId)
  }

  @Delete(':id/participants/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async removeParticipant(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.competitionsService.removeParticipant(id, userId)
  }
}