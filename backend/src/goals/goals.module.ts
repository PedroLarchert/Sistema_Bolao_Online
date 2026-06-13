import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { MatchesModule } from '../matches/matches.module'
import { PrismaModule } from '../prisma/prisma.module'
import { GoalsController } from './goals.controller'
import { GoalsService } from './goals.service'

@Module({
  imports: [PrismaModule, AuthModule, MatchesModule],
  controllers: [GoalsController],
  providers: [GoalsService],
})
export class GoalsModule {}