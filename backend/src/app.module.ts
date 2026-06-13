import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { HealthController } from './health/health.controller'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './prisma/prisma.module'
import { UsersModule } from './users/users.module'
import { CompetitionsModule } from './competitions/competitions.module'
import { TeamsModule } from './teams/teams.module'
import { PlayersModule } from './players/players.module'
import { MatchesModule } from './matches/matches.module'
import { BetsModule } from './bets/bets.module'
import { GoalsModule } from './goals/goals.module'
import { RankingModule } from './ranking/ranking.module'
import { ScoringModule } from './scoring/scoring.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CompetitionsModule,
    TeamsModule,
    PlayersModule,
    MatchesModule,
    BetsModule,
    GoalsModule,
    RankingModule,
    ScoringModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}