import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RankingService } from './ranking.service'

@ApiTags('ranking')
@ApiBearerAuth()
@Controller('competitions/:competitionId/ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getRanking(
    @Param('competitionId', ParseIntPipe) competitionId: number,
    @CurrentUser() user: { sub: number; role: 'ADMIN' | 'USUARIO' },
  ) {
    return this.rankingService.getRanking(competitionId, user.sub, user.role)
  }

  @Get(':userId/details')
  @UseGuards(JwtAuthGuard)
  getDetails(
    @Param('competitionId', ParseIntPipe) competitionId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @CurrentUser() currentUser: { sub: number; role: 'ADMIN' | 'USUARIO' },
  ) {
    return this.rankingService.getDetails(competitionId, userId, currentUser.sub, currentUser.role)
  }
}