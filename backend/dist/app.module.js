"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const health_controller_1 = require("./health/health.controller");
const auth_module_1 = require("./auth/auth.module");
const prisma_module_1 = require("./prisma/prisma.module");
const users_module_1 = require("./users/users.module");
const competitions_module_1 = require("./competitions/competitions.module");
const teams_module_1 = require("./teams/teams.module");
const players_module_1 = require("./players/players.module");
const matches_module_1 = require("./matches/matches.module");
const bets_module_1 = require("./bets/bets.module");
const goals_module_1 = require("./goals/goals.module");
const ranking_module_1 = require("./ranking/ranking.module");
const scoring_module_1 = require("./scoring/scoring.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            competitions_module_1.CompetitionsModule,
            teams_module_1.TeamsModule,
            players_module_1.PlayersModule,
            matches_module_1.MatchesModule,
            bets_module_1.BetsModule,
            goals_module_1.GoalsModule,
            ranking_module_1.RankingModule,
            scoring_module_1.ScoringModule,
        ],
        controllers: [health_controller_1.HealthController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map