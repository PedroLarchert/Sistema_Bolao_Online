import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { CompetitionsModule } from '../competitions/competitions.module'
import { PrismaModule } from '../prisma/prisma.module'
import { MatchesController } from './matches.controller'
import { MatchesService } from './matches.service'

@Module({
  imports: [PrismaModule, AuthModule, CompetitionsModule],
  controllers: [MatchesController],
  providers: [MatchesService],
  exports: [MatchesService],
})
export class MatchesModule {}