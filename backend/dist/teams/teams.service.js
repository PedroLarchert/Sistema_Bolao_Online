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
exports.TeamsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TeamsService = class TeamsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.team.findMany({ orderBy: { id: 'asc' } });
    }
    async findByIdOrFail(teamId) {
        const team = await this.prisma.team.findUnique({ where: { id: teamId } });
        if (!team) {
            throw new common_1.NotFoundException('Time não encontrado');
        }
        return team;
    }
    async create(dto) {
        return this.prisma.team.create({ data: { name: dto.name } });
    }
    async update(teamId, dto) {
        await this.findByIdOrFail(teamId);
        return this.prisma.team.update({ where: { id: teamId }, data: { name: dto.name } });
    }
    async remove(teamId) {
        await this.findByIdOrFail(teamId);
        await this.prisma.team.delete({ where: { id: teamId } });
        return { deleted: true };
    }
};
exports.TeamsService = TeamsService;
exports.TeamsService = TeamsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TeamsService);
//# sourceMappingURL=teams.service.js.map