"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiRequest } from '@/lib/backend'

function toDateInputValue(dateValue: string) {
  return new Date(dateValue).toISOString().slice(0, 10)
}

export function EditCompetitionForm({
  competitionId,
  initialName,
  initialStartDate,
}: {
  competitionId: number
  initialName: string
  initialStartDate: string
}) {
  const router = useRouter()
  const [name, setName] = useState(initialName)
  const [startDate, setStartDate] = useState(toDateInputValue(initialStartDate))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      await apiRequest(`/competitions/${competitionId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name,
          startDate: new Date(startDate).toISOString(),
        }),
      })
      setMessage('Competição atualizada')
      router.refresh()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Erro ao atualizar competição')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor={`competition-name-${competitionId}`}>Nome</Label>
        <Input
          id={`competition-name-${competitionId}`}
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`competition-start-${competitionId}`}>Data de início</Label>
        <Input
          id={`competition-start-${competitionId}`}
          type="date"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
          required
        />
      </div>
      <div className="md:col-span-3 flex items-center gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar competição'}
        </Button>
        {message && <p className="text-sm text-green-600">{message}</p>}
      </div>
      {error && <p className="md:col-span-3 text-sm text-destructive">{error}</p>}
    </form>
  )
}