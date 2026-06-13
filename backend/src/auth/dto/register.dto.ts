import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength } from 'class-validator'

export class RegisterDto {
  @ApiProperty({ example: 'Maria Silva' })
  @IsString()
  name!: string

  @ApiProperty({ example: 'maria' })
  @IsString()
  login!: string

  @ApiProperty({ example: 'senha123' })
  @IsString()
  @MinLength(6)
  password!: string
}