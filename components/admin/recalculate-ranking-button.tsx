"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { apiRequest } from '@/lib/backend'

export function RecalculateRankingButton({ competitionId }: { competitionId: number }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    setLoading(true)
    setError(null)

    try {
      await apiRequest(`/competitions/${competitionId}/scoring/recalculate`, {
        method: 'POST',
      })
      router.refresh()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Erro ao recalcular')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleClick} disabled={loading}>
        {loading ? 'Recalculando...' : 'Recalcular pontuação'}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
