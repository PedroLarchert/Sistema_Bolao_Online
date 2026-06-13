"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplaceOfficialGoalsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const official_goal_item_dto_1 = require("./official-goal-item.dto");
class ReplaceOfficialGoalsDto {
    goals = [];
}
exports.ReplaceOfficialGoalsDto = ReplaceOfficialGoalsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [official_goal_item_dto_1.OfficialGoalItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(0),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => official_goal_item_dto_1.OfficialGoalItemDto),
    __metadata("design:type", Array)
], ReplaceOfficialGoalsDto.prototype, "goals", void 0);
//# sourceMappingURL=replace-official-goals.dto.js.map