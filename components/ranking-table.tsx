"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Crown, Medal, Trophy } from 'lucide-react'
import { RankingDetailsModal } from '@/components/ranking-details-modal'

type RankingEntry = {
  position?: number
  user: {
    id: number
    name: string
    login: string
    role: 'ADMIN' | 'USUARIO'
  }
  totalPoints: number
  betsCount: number
  exactScoreCount: number
  goalDiffCount: number
  winnerCount: number
}

export function RankingTable({ 
  ranking, 
  currentUserId,
  competitionId,
}: { 
  ranking: RankingEntry[]
  currentUserId?: string 
  competitionId: number
}) {
  const [detailsUserId, setDetailsUserId] = useState<number | null>(null)

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />
      default:
        return <span className="w-5 text-center font-bold text-muted-foreground">{position}</span>
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Ranking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {ranking.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum participante ainda
            </p>
          ) : (
            ranking.map((entry, index) => (
              <div
                key={entry.user.id}
                className={`flex items-center gap-4 p-3 rounded-lg ${
                  String(entry.user.id) === currentUserId 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-center w-8">
                  {getPositionIcon(index + 1)}
                </div>

                <Avatar className="h-10 w-10">
                  <AvatarImage src="" alt={entry.user.name} />
                  <AvatarFallback>{getInitials(entry.user.name)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{entry.user.name}</p>
                    {entry.user.role === 'ADMIN' && (
                      <Crown className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{entry.betsCount} palpites</span>
                    <span>{entry.exactScoreCount} exatos</span>
                    <span>{entry.goalDiffCount} dif. gols</span>
                    <span>{entry.winnerCount} vencedores</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold">{entry.totalPoints}</p>
                  <p className="text-xs text-muted-foreground">pontos</p>
                  <Button variant="ghost" size="sm" className="mt-1 px-0" onClick={() => setDetailsUserId(entry.user.id)}>
                    Ver detalhes
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      {detailsUserId !== null && (
        <RankingDetailsModal
          open
          competitionId={competitionId}
          userId={detailsUserId}
          onOpenChange={(value) => {
            if (!value) setDetailsUserId(null)
          }}
        />
      )}
    </Card>
  )
}
