import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { AuthModule } from '../auth/auth.module'
import { CompetitionsController } from './competitions.controller'
import { CompetitionsService } from './competitions.service'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [PrismaModule, AuthModule, UsersModule],
  controllers: [CompetitionsController],
  providers: [CompetitionsService],
  exports: [CompetitionsService],
})
export class CompetitionsModule {}