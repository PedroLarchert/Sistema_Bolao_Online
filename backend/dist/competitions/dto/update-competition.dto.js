"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCompetitionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_competition_dto_1 = require("./create-competition.dto");
class UpdateCompetitionDto extends (0, swagger_1.PartialType)(create_competition_dto_1.CreateCompetitionDto) {
}
exports.UpdateCompetitionDto = UpdateCompetitionDto;
//# sourceMappingURL=update-competition.dto.js.map