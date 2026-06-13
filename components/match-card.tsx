'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Lock, Check, Clock } from 'lucide-react'
import { apiRequest } from '@/lib/backend'

type Match = {
  id: number
  matchDate: Date
  status: string
  homeScore: number | null
  awayScore: number | null
  brazilGame: boolean
  homeTeam: { id: number; name: string; players: Array<{ id: number; name: string }> } | null
  awayTeam: { id: number; name: string; players: Array<{ id: number; name: string }> } | null
  userBet: {
    homeScore: number
    awayScore: number
    playerGoals: Array<{ playerId: number; goalsCount: number; player: { name: string } }>
    score: { pointsTotal: number; resultCriterion: string } | null
  } | null
}

export function MatchCard({ match }: { match: Match }) {
  const [homeScore, setHomeScore] = useState(match.userBet?.homeScore?.toString() || '')
  const [awayScore, setAwayScore] = useState(match.userBet?.awayScore?.toString() || '')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [playerGoals, setPlayerGoals] = useState<Record<number, number>>(() => {
    const initialState: Record<number, number> = {}
    match.userBet?.playerGoals.forEach((goal) => {
      initialState[goal.playerId] = goal.goalsCount
    })
    return initialState
  })

  const isLocked = match.status !== 'SCHEDULED' || new Date(match.matchDate).getTime() <= Date.now()
  const isFinished = match.status === 'FINISHED'

  const players = [...(match.homeTeam?.players ?? []), ...(match.awayTeam?.players ?? [])]

  const handleSave = async () => {
    if (!homeScore || !awayScore) return
    setLoading(true)
    try {
      await apiRequest(`/matches/${match.id}/bet`, {
        method: 'PUT',
        body: JSON.stringify({
          homeScore: Number(homeScore),
          awayScore: Number(awayScore),
          playerGoals: Object.entries(playerGoals)
            .filter(([, goalsCount]) => goalsCount > 0)
            .map(([playerId, goalsCount]) => ({
              playerId: Number(playerId),
              goalsCount,
            })),
        }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error('Error placing bet:', error)
    } finally {
      setLoading(false)
    }
  }

  const getBetResult = () => {
    if (!isFinished || !match.userBet?.score) return null
    const points = match.userBet.score.pointsTotal || 0
    if (match.userBet.homeScore === match.homeScore && match.userBet.awayScore === match.awayScore) {
      return { type: 'exact', points, label: 'Placar Exato!' }
    }
    if (points > 0) {
      return { type: 'partial', points, label: 'Acertou!' }
    }
    return { type: 'wrong', points: 0, label: 'Errou' }
  }

  const betResult = getBetResult()

  return (
    <Card className={`${isFinished ? 'opacity-80' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{format(new Date(match.matchDate), "dd/MM 'às' HH:mm", { locale: ptBR })}</span>
          </div>
          {isLocked && !isFinished && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Travado
            </Badge>
          )}
          {isFinished && (
            <Badge variant="default">Finalizado</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          {/* Home Team */}
          <div className="flex-1 text-center">
            <p className="font-medium truncate">
              {match.homeTeam?.name || 'Time Casa'}
            </p>
          </div>

          {/* Score/Bet Input */}
          <div className="flex items-center gap-2">
            {isFinished ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {match.userBet && (
                    <span className="text-sm text-muted-foreground mr-2">
                      ({match.userBet.homeScore} x {match.userBet.awayScore})
                    </span>
                  )}
                  <span className="text-2xl font-bold">{match.homeScore}</span>
                  <span className="text-xl text-muted-foreground mx-1">x</span>
                  <span className="text-2xl font-bold">{match.awayScore}</span>
                </div>
              </div>
            ) : (
              <>
                <Input
                  type="number"
                  min="0"
                  max="99"
                  value={homeScore}
                  onChange={(e) => setHomeScore(e.target.value)}
                  className="w-14 text-center"
                  disabled={!!isLocked}
                />
                <span className="text-muted-foreground">x</span>
                <Input
                  type="number"
                  min="0"
                  max="99"
                  value={awayScore}
                  onChange={(e) => setAwayScore(e.target.value)}
                  className="w-14 text-center"
                  disabled={!!isLocked}
                />
              </>
            )}
          </div>

          {/* Away Team */}
          <div className="flex-1 text-center">
            <p className="font-medium truncate">
              {match.awayTeam?.name || 'Time Fora'}
            </p>
          </div>
        </div>

        {!isFinished && players.length > 0 && (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {players.map((player) => (
              <label key={player.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                <span>{player.name}</span>
                <Input
                  type="number"
                  min="0"
                  value={playerGoals[player.id] ?? ''}
                  onChange={(event) =>
                    setPlayerGoals((current) => ({
                      ...current,
                      [player.id]: Number(event.target.value),
                    }))
                  }
                  disabled={!!isLocked}
                  className="w-16 text-center"
                />
              </label>
            ))}
          </div>
        )}

        {/* Save Button / Result */}
        <div className="mt-4 flex items-center justify-between">
          {!isLocked && !isFinished && (
            <Button
              size="sm"
              onClick={handleSave}
              disabled={loading || !homeScore || !awayScore}
              className="w-full"
            >
              {saved ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Salvo!
                </>
              ) : loading ? (
                'Salvando...'
              ) : match.userBet ? (
                'Atualizar Palpite'
              ) : (
                'Salvar Palpite'
              )}
            </Button>
          )}

          {betResult && (
            <div className={`w-full text-center py-2 rounded-md ${
              betResult.type === 'exact' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                : betResult.type === 'partial'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
            }`}>
              <span className="font-medium">{betResult.label}</span>
              {betResult.points > 0 && (
                <span className="ml-2">+{betResult.points} pts</span>
              )}
            </div>
          )}

          {isLocked && !isFinished && !match.userBet && (
            <div className="w-full text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Clock className="h-4 w-4" />
              Você não fez palpite para esta partida
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
