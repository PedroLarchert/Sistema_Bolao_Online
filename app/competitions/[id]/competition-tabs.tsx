import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Users, Trophy, Target } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Competition = {
  id: number
  name: string
  description: string | null
  type: string
  status: string
  entryFee: string | null
  prizePool: string | null
  inviteCode: string | null
  isPublic: boolean | null
  maxParticipants: number | null
  startDate: Date | null
  endDate: Date | null
  createdAt: Date
  userPoints?: number | null
}

export function CompetitionTabs({
  competition,
  isAdmin,
}: {
  competition: Competition
  isAdmin: boolean
}) {
  const typeLabels: Record<string, string> = {
    league: 'Liga/Campeonato',
    cup: 'Copa/Torneio',
    custom: 'Personalizado',
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Competição</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Tipo</span>
            <Badge variant="outline">{typeLabels[competition.type] || competition.type}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Visibilidade</span>
            <span>{competition.isPublic ? 'Pública' : 'Privada'}</span>
          </div>

          {competition.maxParticipants && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Limite de Participantes</span>
              <span>{competition.maxParticipants}</span>
            </div>
          )}

          {competition.startDate && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Data de Início</span>
              <span>{format(new Date(competition.startDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
            </div>
          )}

          {competition.endDate && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Data de Término</span>
              <span>{format(new Date(competition.endDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Criada em</span>
            <span>{format(new Date(competition.createdAt), "dd/MM/yyyy", { locale: ptBR })}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Regras de Pontuação</CardTitle>
          <CardDescription>
            Sistema de pontos para os palpites
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span>Placar Exato</span>
            </div>
            <span className="font-bold">10 pontos</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-green-500" />
              <span>Resultado Correto</span>
            </div>
            <span className="font-bold">5 pontos</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 flex items-center justify-center text-blue-500">±</span>
              <span>Saldo de Gols Correto</span>
            </div>
            <span className="font-bold">3 pontos</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Gols do Mandante</span>
            <span className="font-bold">1 ponto</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Gols do Visitante</span>
            <span className="font-bold">1 ponto</span>
          </div>
        </CardContent>
      </Card>

      {isAdmin && competition.inviteCode && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Código de Convite</CardTitle>
            <CardDescription>
              Compartilhe este código para que outros possam entrar na competição
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-4">
              <span className="text-4xl font-mono font-bold tracking-widest">
                {competition.inviteCode}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
