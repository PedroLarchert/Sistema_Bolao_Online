"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { apiRequest } from '@/lib/backend'
import { DeleteEntityButton } from '@/components/admin/delete-entity-button'

type Team = { id: number; name: string }

export function EditableTeamRow({ team }: { team: Team }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(team.name)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await apiRequest(`/teams/${team.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name }),
      })
      setEditing(false)
      router.refresh()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Erro ao atualizar time')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border p-3">
      {editing ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input value={name} onChange={(event) => setName(event.target.value)} required />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex items-center gap-2">
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <span className="font-medium">{team.name}</span>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setEditing(true)}>
              Editar
            </Button>
            <DeleteEntityButton endpoint={`/teams/${team.id}`} label="Excluir" />
          </div>
        </div>
      )}
    </div>
  )
}