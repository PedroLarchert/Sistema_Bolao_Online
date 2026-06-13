"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { apiRequest } from '@/lib/backend'

export function DeleteEntityButton({ endpoint, label }: { endpoint: string; label: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    setLoading(true)
    setError(null)

    try {
      await apiRequest(endpoint, { method: 'DELETE' })
      router.refresh()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Erro ao excluir')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="destructive" size="sm" onClick={handleClick} disabled={loading}>
        {loading ? 'Excluindo...' : label}
      </Button>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  )
}
