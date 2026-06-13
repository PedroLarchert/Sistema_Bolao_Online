import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Users, Calendar, Crown } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Competition = {
  id: number
  name: string
  status: string
  startDate: Date | null
  _count?: {
    participants: number
    matches: number
  }
  myStanding?: {
    totalPoints: number
  } | null
  isParticipant?: boolean
}

export function CompetitionCard({ competition }: { competition: Competition }) {
  const statusColors: Record<string, string> = {
    DRAFT: 'bg-muted text-muted-foreground',
    ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    CLOSED: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
  }

  const statusLabels: Record<string, string> = {
    DRAFT: 'Rascunho',
    ACTIVE: 'Ativo',
    CLOSED: 'Finalizado',
  }

  return (
    <Link href={`/competitions/${competition.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg line-clamp-1">{competition.name}</CardTitle>
            </div>
            <Badge className={statusColors[competition.status] || ''} variant="secondary">
              {statusLabels[competition.status] || competition.status}
            </Badge>
          </div>
          <CardDescription>
            {competition.isParticipant ? 'Você já participa desta competição' : 'Competição disponível'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{competition._count?.participants ?? 0} participantes</span>
            </div>
            
            {competition.myStanding && (
              <div className="flex items-center gap-1">
                <Crown className="h-4 w-4 text-yellow-500" />
                <span>{competition.myStanding.totalPoints} pts</span>
              </div>
            )}

            {competition.startDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(competition.startDate), "dd MMM", { locale: ptBR })}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
