import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { Roles } from '../common/decorators/roles.decorator'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { CreateMatchDto } from './dto/create-match.dto'
import { UpdateMatchDto } from './dto/update-match.dto'
import { UpdateScoreDto } from './dto/update-score.dto'
import { MatchesService } from './matches.service'

@ApiTags('matches')
@ApiBearerAuth()
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('competitionId') competitionId: string | undefined,
    @CurrentUser() user: { sub: number; role: 'ADMIN' | 'USUARIO' },
  ) {
    return this.matchesService.findVisible(competitionId ? Number(competitionId) : undefined, user.sub, user.role)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.matchesService.findById(id)
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() dto: CreateMatchDto) {
    return this.matchesService.create(dto)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMatchDto) {
    return this.matchesService.update(id, dto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.matchesService.remove(id)
  }

  @Patch(':id/score')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateScore(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateScoreDto) {
    return this.matchesService.updateScore(id, dto)
  }
}