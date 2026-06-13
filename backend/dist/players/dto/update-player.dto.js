"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePlayerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_player_dto_1 = require("./create-player.dto");
class UpdatePlayerDto extends (0, swagger_1.PartialType)(create_player_dto_1.CreatePlayerDto) {
}
exports.UpdatePlayerDto = UpdatePlayerDto;
//# sourceMappingURL=update-player.dto.js.map