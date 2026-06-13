import { redirect, notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { MatchCard } from '@/components/match-card'
import { RankingTable } from '@/components/ranking-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trophy } from 'lucide-react'
import Link from 'next/link'
import { getServerToken, serverApiRequest } from '@/lib/server-backend'

export default async function CompetitionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const toArray = <T,>(value: T | T[] | null | undefined): T[] => {
    if (Array.isArray(value)) {
      return value
    }

    return value ? [value] : []
  }

  const token = await getServerToken()
  if (!token) redirect('/sign-in')

  const { id } = await params
  const competitionId = Number(id)

  if (Number.isNaN(competitionId)) notFound()

  let session
  let competition
  let matches
  let ranking

  try {
    ;[session, competition, matches, ranking] = await Promise.all([
      serverApiRequest<{ sub: number; login: string; role: 'ADMIN' | 'USUARIO'; name: string }>('/auth/me'),
      serverApiRequest<{
        id: number
        name: string
        status: string
        startDate: string
        myStanding?: { totalPoints: number } | null
        participants?: Array<{ user: { id: number; name: string; login: string; role: 'ADMIN' | 'USUARIO' } }>
        isParticipant?: boolean
      }>(`/competitions/${competitionId}`),
      serverApiRequest<Array<{
        id: number
        matchDate: string
        status: string
        homeScore: number | null
        awayScore: number | null
        brazilGame: boolean
        homeTeam: { id: number; name: string; players: Array<{ id: number; name: string }> }
        awayTeam: { id: number; name: string; players: Array<{ id: number; name: string }> }
        userBet: {
          homeScore: number
          awayScore: number
          playerGoals: Array<{ playerId: number; goalsCount: number; player: { name: string } }>
          score: { pointsTotal: number; resultCriterion: string } | null
        } | null
      }>(`/matches?competitionId=${competitionId}`),
      serverApiRequest<Array<{
        user: { id: number; name: string; login: string; role: 'ADMIN' | 'USUARIO' }
        totalPoints: number
        betsCount: number
        exactScoreCount: number
        goalDiffCount: number
        winnerCount: number
      }>>(`/competitions/${competitionId}/ranking`),
    ])
  } catch (error) {
    redirect('/sign-in')
  }

  matches = toArray(matches)
  ranking = toArray(ranking)

  const upcomingMatches = matches.filter((match) => match.status === 'SCHEDULED')
  const finishedMatches = matches.filter((match) => match.status === 'FINISHED')

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col gap-2">
          <h1 className="text-3xl font-bold">{competition.name}</h1>
          <p className="text-muted-foreground">
            {competition.isParticipant ? 'Você participa desta competição.' : 'Competição restrita.'}
          </p>
          {session.role === 'ADMIN' && (
            <div>
              <Button asChild>
                <Link href={`/competitions/${competitionId}/admin`}>Abrir administração</Link>
              </Button>
            </div>
          )}
        </div>

        <Tabs defaultValue="matches" className="mt-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="matches">Partidas</TabsTrigger>
            <TabsTrigger value="ranking">Ranking</TabsTrigger>
            <TabsTrigger value="info">Informações</TabsTrigger>
          </TabsList>

          <TabsContent value="matches" className="mt-6">
            {!competition.isParticipant ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
                  <CardTitle className="text-lg mb-2">Você não participa desta competição</CardTitle>
                  <CardDescription className="text-center max-w-md">
                    Entre na competição para ver as partidas e fazer seus palpites.
                  </CardDescription>
                </CardContent>
              </Card>
            ) : matches.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
                  <CardTitle className="text-lg mb-2">Nenhuma partida cadastrada</CardTitle>
                  <CardDescription className="text-center max-w-md">
                    Aguarde o administrador adicionar as partidas.
                  </CardDescription>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {upcomingMatches.length > 0 && (
                  <div>
                    <h3 className="mb-4 text-lg font-semibold">Próximas Partidas</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {upcomingMatches.map((match) => (
                        <MatchCard key={match.id} match={match} />
                      ))}
                    </div>
                  </div>
                )}

                {finishedMatches.length > 0 && (
                  <div>
                    <h3 className="mb-4 text-lg font-semibold">Partidas Finalizadas</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {finishedMatches.map((match) => (
                        <MatchCard key={match.id} match={match} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="ranking" className="mt-6">
            <RankingTable ranking={ranking} currentUserId={String(session.sub)} competitionId={competitionId} />
          </TabsContent>

          <TabsContent value="info" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações</CardTitle>
                <CardDescription>Resumo da competição e da sua participação</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Pontos atuais</span>
                  <span className="font-medium">{competition.myStanding?.totalPoints ?? 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Participantes</span>
                  <span className="font-medium">{competition.participants?.length ?? 0}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
