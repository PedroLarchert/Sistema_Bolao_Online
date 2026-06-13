"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { apiRequest } from '@/lib/backend'
import { DeleteEntityButton } from '@/components/admin/delete-entity-button'

type Team = { id: number; name: string }
type Player = { id: number; name: string; team: { id: number; name: string } | null }

export function EditablePlayerRow({ player, teams }: { player: Player; teams: Team[] }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(player.name)
  const [teamId, setTeamId] = useState(String(player.team?.id ?? teams[0]?.id ?? ''))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await apiRequest(`/players/${player.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name,
          teamId: Number(teamId),
        }),
      })
      setEditing(false)
      router.refresh()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Erro ao atualizar jogador')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border p-3">
      {editing ? (
        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-3">
          <div className="md:col-span-2 space-y-2">
            <Input value={name} onChange={(event) => setName(event.target.value)} required />
          </div>
          <div className="space-y-2">
            <Select value={teamId} onValueChange={setTeamId}>
              <SelectTrigger>
                <SelectValue placeholder="Time" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={String(team.id)}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-3 flex items-center gap-2">
            <Button type="submit" size="sm" disabled={loading || !teamId}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(false)}>
              Cancelar
            </Button>
          </div>
          {error && <p className="md:col-span-3 text-sm text-destructive">{error}</p>}
        </form>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-medium">{player.name}</p>
            <p className="text-sm text-muted-foreground">{player.team?.name ?? 'Sem time'}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setEditing(true)}>
              Editar
            </Button>
            <DeleteEntityButton endpoint={`/players/${player.id}`} label="Excluir" />
          </div>
        </div>
      )}
    </div>
  )
}