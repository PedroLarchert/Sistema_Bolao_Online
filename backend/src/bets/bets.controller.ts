import { Body, Controller, Delete, Get, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { BetsService } from './bets.service'
import { UpsertBetDto } from './dto/upsert-bet.dto'

@ApiTags('bets')
@ApiBearerAuth()
@Controller()
export class BetsController {
  constructor(private readonly betsService: BetsService) {}

  @Put('matches/:matchId/bet')
  @UseGuards(JwtAuthGuard)
  upsert(
    @Param('matchId', ParseIntPipe) matchId: number,
    @Body() dto: UpsertBetDto,
    @CurrentUser() user: { sub: number; role: 'ADMIN' | 'USUARIO' },
  ) {
    return this.betsService.upsert(user.sub, user.role, matchId, dto)
  }

  @Get('matches/:matchId/bet')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('matchId', ParseIntPipe) matchId: number, @CurrentUser() user: { sub: number }) {
    return this.betsService.findOne(user.sub, matchId)
  }

  @Delete('matches/:matchId/bet')
  @UseGuards(JwtAuthGuard)
  remove(@Param('matchId', ParseIntPipe) matchId: number, @CurrentUser() user: { sub: number }) {
    return this.betsService.remove(user.sub, matchId)
  }

  @Get('competitions/:competitionId/bets/mine')
  @UseGuards(JwtAuthGuard)
  findMine(
    @Param('competitionId', ParseIntPipe) competitionId: number,
    @CurrentUser() user: { sub: number; role: 'ADMIN' | 'USUARIO' },
  ) {
    return this.betsService.findMineByCompetition(user.sub, competitionId, user.role)
  }
}