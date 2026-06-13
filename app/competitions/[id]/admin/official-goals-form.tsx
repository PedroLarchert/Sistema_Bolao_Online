"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiRequest } from '@/lib/backend'

export type MatchPlayer = {
  id: number
  name: string
}

export function OfficialGoalsForm({
  matchId,
  players,
}: {
  matchId: number
  players: MatchPlayer[]
}) {
  const router = useRouter()
  const [selectedPlayerId, setSelectedPlayerId] = useState('')
  const [goalsCount, setGoalsCount] = useState('1')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      await apiRequest(`/matches/${matchId}/goals`, {
        method: 'PUT',
        body: JSON.stringify({
          goals: [
            {
              playerId: Number(selectedPlayerId),
              goalsCount: Number(goalsCount),
            },
          ],
        }),
      })
      setMessage('Gols oficiais atualizados')
      setSelectedPlayerId('')
      setGoalsCount('1')
      router.refresh()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Erro ao atualizar gols')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border p-4">
      <div className="space-y-2">
        <Label>Jogador</Label>
        <select
          value={selectedPlayerId}
          onChange={(event) => setSelectedPlayerId(event.target.value)}
          className="h-10 w-full rounded-md border bg-background px-3 text-sm"
        >
          <option value="">Selecione um jogador</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`goals-${matchId}`}>Gols</Label>
        <Input
          id={`goals-${matchId}`}
          type="number"
          min="0"
          value={goalsCount}
          onChange={(event) => setGoalsCount(event.target.value)}
          required
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {message && <p className="text-sm text-green-600">{message}</p>}
      <Button type="submit" disabled={loading || !selectedPlayerId} size="sm">
        {loading ? 'Salvando...' : 'Salvar gols oficiais'}
      </Button>
    </form>
  )
}
