"use client"

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { apiRequest } from '@/lib/backend'

export type RankingDetailItem = {
  id: number
  homeScore: number
  awayScore: number
  match: {
    id: number
    matchDate: string
    homeTeam: { name: string }
    awayTeam: { name: string }
    homeScore: number | null
    awayScore: number | null
  }
  score: {
    pointsResult: number
    pointsPlayerGoals: number
    pointsTotal: number
    resultCriterion: string
    brazilGame: boolean
  } | null
  playerGoals: Array<{
    playerId: number
    goalsCount: number
    player: { name: string }
  }>
}

export function RankingDetailsModal({
  open,
  competitionId,
  userId,
  onOpenChange,
}: {
  open: boolean
  competitionId: number
  userId: number
  onOpenChange: (open: boolean) => void
}) {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<RankingDetailItem[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !competitionId || !userId) {
      return
    }

    setLoading(true)
    setError(null)

    apiRequest<RankingDetailItem[]>(`/competitions/${competitionId}/ranking/${userId}/details`)
      .then(setItems)
      .catch((requestError) => {
        setError(requestError instanceof Error ? requestError.message : 'Erro ao carregar detalhes')
      })
      .finally(() => setLoading(false))
  }, [open, competitionId, userId])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalhes da pontuação</DialogTitle>
          <DialogDescription>Comparativo entre o palpite, o placar oficial e a pontuação obtida.</DialogDescription>
        </DialogHeader>

        {loading ? (
          <p className="py-8 text-sm text-muted-foreground">Carregando detalhes...</p>
        ) : error ? (
          <p className="py-8 text-sm text-destructive">{error}</p>
        ) : items.length === 0 ? (
          <p className="py-8 text-sm text-muted-foreground">Nenhum palpite encontrado para este usuário.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="rounded-lg border p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">
                      {item.match.homeTeam.name} x {item.match.awayTeam.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.match.matchDate).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {item.score?.resultCriterion || 'ERROU'}
                  </Badge>
                </div>

                <div className="grid gap-3 md:grid-cols-3 text-sm">
                  <div className="rounded-md bg-muted p-3">
                    <p className="text-muted-foreground">Palpite</p>
                    <p className="font-semibold">
                      {item.homeScore} x {item.awayScore}
                    </p>
                  </div>
                  <div className="rounded-md bg-muted p-3">
                    <p className="text-muted-foreground">Placar oficial</p>
                    <p className="font-semibold">
                      {item.match.homeScore ?? '-'} x {item.match.awayScore ?? '-'}
                    </p>
                  </div>
                  <div className="rounded-md bg-muted p-3">
                    <p className="text-muted-foreground">Pontos</p>
                    <p className="font-semibold">
                      {item.score?.pointsTotal ?? 0}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium">Palpites de gols</p>
                  <div className="flex flex-wrap gap-2">
                    {item.playerGoals.length === 0 ? (
                      <span className="text-sm text-muted-foreground">Nenhum jogador selecionado</span>
                    ) : (
                      item.playerGoals.map((goal) => (
                        <Badge key={goal.playerId} variant="outline">
                          {goal.player.name}: {goal.goalsCount}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
