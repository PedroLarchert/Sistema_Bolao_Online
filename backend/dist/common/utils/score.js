"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeCriterion = computeCriterion;
exports.computeResultPoints = computeResultPoints;
exports.countPlayerGoalPoints = countPlayerGoalPoints;
exports.shouldLockBet = shouldLockBet;
const client_1 = require("@prisma/client");
function computeCriterion(official, bet) {
    const officialDiff = official.homeScore - official.awayScore;
    const betDiff = bet.homeScore - bet.awayScore;
    if (official.homeScore === bet.homeScore && official.awayScore === bet.awayScore) {
        return client_1.ScoringCriterion.PLACAR_EXATO;
    }
    if (officialDiff === betDiff) {
        return client_1.ScoringCriterion.DIFERENCA_GOLS;
    }
    if (Math.sign(officialDiff) === Math.sign(betDiff) ||
        (officialDiff === 0 && betDiff === 0)) {
        return client_1.ScoringCriterion.VENCEDOR;
    }
    return client_1.ScoringCriterion.ERROU;
}
function computeResultPoints(criterion, brazilGame) {
    const scores = brazilGame
        ? {
            [client_1.ScoringCriterion.PLACAR_EXATO]: 25,
            [client_1.ScoringCriterion.DIFERENCA_GOLS]: 15,
            [client_1.ScoringCriterion.VENCEDOR]: 10,
            [client_1.ScoringCriterion.ERROU]: 0,
        }
        : {
            [client_1.ScoringCriterion.PLACAR_EXATO]: 10,
            [client_1.ScoringCriterion.DIFERENCA_GOLS]: 7,
            [client_1.ScoringCriterion.VENCEDOR]: 5,
            [client_1.ScoringCriterion.ERROU]: 0,
        };
    return scores[criterion];
}
function countPlayerGoalPoints(predictedGoals, officialGoals) {
    const officialMap = new Map(officialGoals.map((goal) => [goal.playerId, goal.goalsCount]));
    return predictedGoals.reduce((total, predictedGoal) => {
        const officialCount = officialMap.get(predictedGoal.playerId) ?? 0;
        return total + Math.min(predictedGoal.goalsCount, officialCount) * 5;
    }, 0);
}
function shouldLockBet(matchDate, status) {
    return status !== client_1.MatchStatus.SCHEDULED || matchDate.getTime() <= Date.now();
}
//# sourceMappingURL=score.js.map