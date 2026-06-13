'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { apiRequest } from '@/lib/backend'

type Team = {
  id: number
  name: string
}

export function AddMatchForm({
  competitionId,
  teams,
}: {
  competitionId: number
  teams: Team[]
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [homeTeamId, setHomeTeamId] = useState('')
  const [awayTeamId, setAwayTeamId] = useState('')
  const [matchDate, setMatchDate] = useState('')
  const [matchTime, setMatchTime] = useState('')
  const [brazilGame, setBrazilGame] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (homeTeamId === awayTeamId) {
      setError('Os times devem ser diferentes')
      return
    }

    setLoading(true)

    try {
      const dateTime = new Date(`${matchDate}T${matchTime}`)

      await apiRequest('/matches', {
        method: 'POST',
        body: JSON.stringify({
          competitionId,
          homeTeamId: Number(homeTeamId),
          awayTeamId: Number(awayTeamId),
          matchDate: dateTime.toISOString(),
          brazilGame,
        }),
      })

      setHomeTeamId('')
      setAwayTeamId('')
      setMatchDate('')
      setMatchTime('')
      setBrazilGame(false)

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar partida')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="homeTeam">Time da Casa</Label>
          <Select value={homeTeamId} onValueChange={setHomeTeamId} required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o time" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id.toString()}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="awayTeam">Time Visitante</Label>
          <Select value={awayTeamId} onValueChange={setAwayTeamId} required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o time" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id.toString()}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="matchDate">Data</Label>
          <Input
            id="matchDate"
            type="date"
            value={matchDate}
            onChange={(e) => setMatchDate(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="matchTime">Horário</Label>
          <Input
            id="matchTime"
            type="time"
            value={matchTime}
            onChange={(e) => setMatchTime(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Input
          id="brazilGame"
          type="checkbox"
          checked={brazilGame}
          onChange={(event) => setBrazilGame(event.target.checked)}
          className="h-4 w-4"
        />
        <Label htmlFor="brazilGame">Jogo do Brasil</Label>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <Button type="submit" disabled={loading || teams.length < 2}>
        {loading ? 'Adicionando...' : 'Adicionar Partida'}
      </Button>

      {teams.length < 2 && (
        <p className="text-sm text-muted-foreground">
          Cadastre pelo menos 2 times antes de adicionar partidas.
        </p>
      )}
    </form>
  )
}
