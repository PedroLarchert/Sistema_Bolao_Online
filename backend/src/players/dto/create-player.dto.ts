import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsString, Min } from 'class-validator'

export class CreatePlayerDto {
  @ApiProperty({ example: 'Neymar' })
  @IsString()
  name!: string

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  teamId!: number
}