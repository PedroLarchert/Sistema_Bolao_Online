import { MatchStatus, ScoringCriterion } from '@prisma/client'

type OfficialResult = {
  homeScore: number
  awayScore: number
  brazilGame: boolean
}

type BetResult = {
  homeScore: number
  awayScore: number
}

export function computeCriterion(official: OfficialResult, bet: BetResult): ScoringCriterion {
  const officialDiff = official.homeScore - official.awayScore
  const betDiff = bet.homeScore - bet.awayScore

  if (official.homeScore === bet.homeScore && official.awayScore === bet.awayScore) {
    return ScoringCriterion.PLACAR_EXATO
  }

  if (officialDiff === betDiff) {
    return ScoringCriterion.DIFERENCA_GOLS
  }

  if (
    Math.sign(officialDiff) === Math.sign(betDiff) ||
    (officialDiff === 0 && betDiff === 0)
  ) {
    return ScoringCriterion.VENCEDOR
  }

  return ScoringCriterion.ERROU
}

export function computeResultPoints(criterion: ScoringCriterion, brazilGame: boolean): number {
  const scores = brazilGame
    ? {
        [ScoringCriterion.PLACAR_EXATO]: 25,
        [ScoringCriterion.DIFERENCA_GOLS]: 15,
        [ScoringCriterion.VENCEDOR]: 10,
        [ScoringCriterion.ERROU]: 0,
      }
    : {
        [ScoringCriterion.PLACAR_EXATO]: 10,
        [ScoringCriterion.DIFERENCA_GOLS]: 7,
        [ScoringCriterion.VENCEDOR]: 5,
        [ScoringCriterion.ERROU]: 0,
      }

  return scores[criterion]
}

export function countPlayerGoalPoints(
  predictedGoals: Array<{ playerId: number; goalsCount: number }>,
  officialGoals: Array<{ playerId: number; goalsCount: number }>,
): number {
  const officialMap = new Map(officialGoals.map((goal) => [goal.playerId, goal.goalsCount]))

  return predictedGoals.reduce((total, predictedGoal) => {
    const officialCount = officialMap.get(predictedGoal.playerId) ?? 0
    return total + Math.min(predictedGoal.goalsCount, officialCount) * 5
  }, 0)
}

export function shouldLockBet(matchDate: Date, status: MatchStatus): boolean {
  return status !== MatchStatus.SCHEDULED || matchDate.getTime() <= Date.now()
}