import { Controller, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Roles } from '../common/decorators/roles.decorator'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { ScoringService } from './scoring.service'

@ApiTags('scoring')
@ApiBearerAuth()
@Controller('competitions/:competitionId/scoring')
export class ScoringController {
  constructor(private readonly scoringService: ScoringService) {}

  @Post('recalculate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  recalculate(@Param('competitionId', ParseIntPipe) competitionId: number) {
    return this.scoringService.recalculateCompetition(competitionId)
  }
}