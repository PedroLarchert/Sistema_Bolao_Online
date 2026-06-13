'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { UserPlus } from 'lucide-react'
import { apiRequest } from '@/lib/backend'

export function JoinCompetitionDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [competitionId, setCompetitionId] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await apiRequest(`/competitions/${competitionId}/join`, {
        method: 'POST',
      })
      setOpen(false)
      router.push(`/competitions/${competitionId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Competição não encontrada')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus className="mr-2 h-4 w-4" />
          Entrar por ID
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Entrar em uma Competição</DialogTitle>
          <DialogDescription>
            Digite o ID da competição para participar dela.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="competitionId">ID da competição</Label>
            <Input
              id="competitionId"
              type="number"
              value={competitionId}
              onChange={(e) => setCompetitionId(e.target.value)}
              placeholder="Ex: 1"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !competitionId}>
              {loading ? 'Entrando...' : 'Participar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
