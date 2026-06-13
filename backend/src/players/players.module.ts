import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { PrismaModule } from '../prisma/prisma.module'
import { PlayersController } from './players.controller'
import { PlayersService } from './players.service'

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [PlayersController],
  providers: [PlayersService],
})
export class PlayersModule {}