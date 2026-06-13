'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiRequest } from '@/lib/backend'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Match = {
  id: number
  matchDate: string
  homeTeam: { id: number; name: string } | null
  awayTeam: { id: number; name: string } | null
}

export function MatchResultForm({ match }: { match: Match }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [homeScore, setHomeScore] = useState('')
  const [awayScore, setAwayScore] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await apiRequest(`/matches/${match.id}/score`, {
        method: 'PATCH',
        body: JSON.stringify({
          homeScore: Number(homeScore),
          awayScore: Number(awayScore),
        }),
      })
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar resultado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        <div className="flex-1">
          <p className="font-medium">
            {match.homeTeam?.name || 'Time Casa'} vs {match.awayTeam?.name || 'Time Fora'}
          </p>
          <p className="text-sm text-muted-foreground">
            {format(new Date(match.matchDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
        <div className="flex items-center gap-2">
          <div className="space-y-1">
            <Label htmlFor={`home-${match.id}`} className="text-xs">
              {match.homeTeam?.name || 'Casa'}
            </Label>
            <Input
              id={`home-${match.id}`}
              type="number"
              min="0"
              max="99"
              value={homeScore}
              onChange={(e) => setHomeScore(e.target.value)}
              className="w-16 text-center"
              required
            />
          </div>
          <span className="text-muted-foreground mb-1">x</span>
          <div className="space-y-1">
            <Label htmlFor={`away-${match.id}`} className="text-xs">
              {match.awayTeam?.name || 'Fora'}
            </Label>
            <Input
              id={`away-${match.id}`}
              type="number"
              min="0"
              max="99"
              value={awayScore}
              onChange={(e) => setAwayScore(e.target.value)}
              className="w-16 text-center"
              required
            />
          </div>
        </div>

        <Button type="submit" disabled={loading} size="sm">
          {loading ? 'Salvando...' : 'Salvar Resultado'}
        </Button>

        {error && (
          <p className="text-sm text-destructive w-full">{error}</p>
        )}
      </form>
    </div>
  )
}
