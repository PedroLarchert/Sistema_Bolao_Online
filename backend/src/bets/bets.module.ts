import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { CompetitionsModule } from '../competitions/competitions.module'
import { MatchesModule } from '../matches/matches.module'
import { PrismaModule } from '../prisma/prisma.module'
import { BetsController } from './bets.controller'
import { BetsService } from './bets.service'

@Module({
  imports: [PrismaModule, AuthModule, CompetitionsModule, MatchesModule],
  controllers: [BetsController],
  providers: [BetsService],
  exports: [BetsService],
})
export class BetsModule {}