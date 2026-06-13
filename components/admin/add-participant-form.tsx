"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { apiRequest } from '@/lib/backend'

export function AddParticipantForm({
  competitionId,
  users,
}: {
  competitionId: number
  users: Array<{ id: number; name: string; login: string }>
}) {
  const router = useRouter()
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await apiRequest(`/competitions/${competitionId}/participants/${userId}`, {
        method: 'POST',
      })
      setUserId('')
      router.refresh()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Erro ao adicionar participante')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Select value={userId} onValueChange={setUserId}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione um usuário" />
        </SelectTrigger>
        <SelectContent>
          {users.map((user) => (
            <SelectItem key={user.id} value={String(user.id)}>
              {user.name} ({user.login})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={loading || !userId}>
        {loading ? 'Salvando...' : 'Adicionar participante'}
      </Button>
    </form>
  )
}
