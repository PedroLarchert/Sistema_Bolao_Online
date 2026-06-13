import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator'
import { UserRole } from '@prisma/client'

export class CreateUserDto {
  @ApiProperty({ example: 'Joao Silva' })
  @IsString()
  name!: string

  @ApiProperty({ example: 'joao' })
  @IsString()
  login!: string

  @ApiProperty({ example: 'senha123' })
  @IsString()
  @MinLength(6)
  password!: string

  @ApiProperty({ enum: UserRole, example: UserRole.USUARIO })
  @IsEnum(UserRole)
  role!: UserRole
}