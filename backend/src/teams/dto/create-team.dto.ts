import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateTeamDto {
  @ApiProperty({ example: 'Brasil' })
  @IsString()
  name!: string
}