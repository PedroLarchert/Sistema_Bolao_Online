import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsDateString, IsInt, Min } from 'class-validator'

export class CreateMatchDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  competitionId!: number

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  homeTeamId!: number

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  awayTeamId!: number

  @ApiProperty({ example: '2026-06-10T19:00:00.000Z' })
  @IsDateString()
  matchDate!: string

  @ApiProperty({ example: false })
  @IsBoolean()
  brazilGame!: boolean
}