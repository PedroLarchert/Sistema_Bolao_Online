import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Min } from 'class-validator'

export class PlayerGoalDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  playerId!: number

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(0)
  goalsCount!: number
}