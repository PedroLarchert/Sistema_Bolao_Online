import { ApiProperty } from '@nestjs/swagger'
import { ArrayNotEmpty, IsArray, IsInt, Min, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { PlayerGoalDto } from './player-goal.dto'

export class UpsertBetDto {
  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(0)
  homeScore!: number

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(0)
  awayScore!: number

  @ApiProperty({ type: [PlayerGoalDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlayerGoalDto)
  playerGoals: PlayerGoalDto[] = []
}