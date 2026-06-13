import { ApiProperty } from '@nestjs/swagger'
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { OfficialGoalItemDto } from './official-goal-item.dto'

export class ReplaceOfficialGoalsDto {
  @ApiProperty({ type: [OfficialGoalItemDto] })
  @IsArray()
  @ArrayMinSize(0)
  @ValidateNested({ each: true })
  @Type(() => OfficialGoalItemDto)
  goals: OfficialGoalItemDto[] = []
}