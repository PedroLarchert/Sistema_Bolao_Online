import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { CompetitionsModule } from '../competitions/competitions.module'
import { PrismaModule } from '../prisma/prisma.module'
import { RankingController } from './ranking.controller'
import { RankingService } from './ranking.service'

@Module({
  imports: [PrismaModule, AuthModule, CompetitionsModule],
  controllers: [RankingController],
  providers: [RankingService],
  exports: [RankingService],
})
export class RankingModule {}