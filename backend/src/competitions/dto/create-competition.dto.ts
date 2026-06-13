import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsString } from 'class-validator'

export class CreateCompetitionDto {
  @ApiProperty({ example: 'Copa do Mundo 2026' })
  @IsString()
  name!: string

  @ApiProperty({ example: '2026-06-01T00:00:00.000Z' })
  @IsDateString()
  startDate!: string
}