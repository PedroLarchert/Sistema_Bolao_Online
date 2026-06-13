import { Body, Controller, Get, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Roles } from '../common/decorators/roles.decorator'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { ReplaceOfficialGoalsDto } from './dto/replace-official-goals.dto'
import { GoalsService } from './goals.service'

@ApiTags('goals')
@ApiBearerAuth()
@Controller('matches/:matchId/goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findOne(@Param('matchId', ParseIntPipe) matchId: number) {
    return this.goalsService.getOne(matchId)
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  replace(@Param('matchId', ParseIntPipe) matchId: number, @Body() dto: ReplaceOfficialGoalsDto) {
    return this.goalsService.replace(matchId, dto)
  }
}