import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { BetsModule } from '../bets/bets.module'
import { MatchesModule } from '../matches/matches.module'
import { PrismaModule } from '../prisma/prisma.module'
import { RankingModule } from '../ranking/ranking.module'
import { ScoringController } from './scoring.controller'
import { ScoringService } from './scoring.service'

@Module({
  imports: [PrismaModule, AuthModule, BetsModule, MatchesModule, RankingModule],
  controllers: [ScoringController],
  providers: [ScoringService],
})
export class ScoringModule {}