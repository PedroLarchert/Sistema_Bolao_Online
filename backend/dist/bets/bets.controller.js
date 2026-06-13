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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BetsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const bets_service_1 = require("./bets.service");
const upsert_bet_dto_1 = require("./dto/upsert-bet.dto");
let BetsController = class BetsController {
    betsService;
    constructor(betsService) {
        this.betsService = betsService;
    }
    upsert(matchId, dto, user) {
        return this.betsService.upsert(user.sub, user.role, matchId, dto);
    }
    findOne(matchId, user) {
        return this.betsService.findOne(user.sub, matchId);
    }
    remove(matchId, user) {
        return this.betsService.remove(user.sub, matchId);
    }
    findMine(competitionId, user) {
        return this.betsService.findMineByCompetition(user.sub, competitionId, user.role);
    }
};
exports.BetsController = BetsController;
__decorate([
    (0, common_1.Put)('matches/:matchId/bet'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('matchId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, upsert_bet_dto_1.UpsertBetDto, Object]),
    __metadata("design:returntype", void 0)
], BetsController.prototype, "upsert", null);
__decorate([
    (0, common_1.Get)('matches/:matchId/bet'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('matchId', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], BetsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)('matches/:matchId/bet'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('matchId', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], BetsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('competitions/:competitionId/bets/mine'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('competitionId', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], BetsController.prototype, "findMine", null);
exports.BetsController = BetsController = __decorate([
    (0, swagger_1.ApiTags)('bets'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [bets_service_1.BetsService])
], BetsController);
//# sourceMappingURL=bets.controller.js.map