import { redirect, notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Settings, Calendar, Trophy, Users, Target } from 'lucide-react'
import Link from 'next/link'
import { getServerToken, serverApiRequest } from '@/lib/server-backend'
import { AddMatchForm } from './add-match-form'
import { MatchResultForm } from './match-result-form'
import { OfficialGoalsForm } from './official-goals-form'
import { CreateTeamForm } from '@/components/admin/create-team-form'
import { CreatePlayerForm } from '@/components/admin/create-player-form'
import { AddParticipantForm } from '@/components/admin/add-participant-form'
import { DeleteEntityButton } from '@/components/admin/delete-entity-button'
import { RecalculateRankingButton } from '@/components/admin/recalculate-ranking-button'
import { EditCompetitionForm } from '@/components/admin/edit-competition-form'
import { EditableTeamRow } from '@/components/admin/editable-team-row'
import { EditablePlayerRow } from '@/components/admin/editable-player-row'

export default async function CompetitionAdminPage({
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

  const [session, competition, matches, teams, users, participants, players] = await Promise.all([
    serverApiRequest<{ sub: number; login: string; role: 'ADMIN' | 'USUARIO'; name: string }>('/auth/me'),
    serverApiRequest<{
      id: number
      name: string
      status: string
      startDate: string
      isParticipant?: boolean
    }>(`/competitions/${competitionId}`),
    serverApiRequest<Array<{
      id: number
      matchDate: string
      status: string
      homeScore: number | null
      awayScore: number | null
      homeTeam: { id: number; name: string; players: Array<{ id: number; name: string }> }
      awayTeam: { id: number; name: string; players: Array<{ id: number; name: string }> }
    }>>(`/matches?competitionId=${competitionId}`),
    serverApiRequest<Array<{ id: number; name: string }>>('/teams'),
    serverApiRequest<Array<{ id: number; name: string; team: { id: number; name: string } | null }>>('/players'),
    serverApiRequest<Array<{ id: number; name: string; login: string; role: 'ADMIN' | 'USUARIO' }>>('/users'),
    serverApiRequest<Array<{ user: { id: number; name: string; login: string } }>>(`/competitions/${competitionId}/participants`),
  ])

  const normalizedMatches = toArray(matches)
  const normalizedTeams = toArray(teams)
  const normalizedUsers = toArray(users)
  const normalizedParticipants = toArray(participants)
  const normalizedPlayers = toArray(players)
  const safeParticipants = normalizedParticipants.filter((participant) => Boolean(participant?.user))

  if (session.role !== 'ADMIN') redirect(`/competitions/${competitionId}`)

  const scheduledMatches = normalizedMatches.filter((match) => match.status === 'SCHEDULED')
  const finishedMatches = normalizedMatches.filter((match) => match.status === 'FINISHED')

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/competitions/${competitionId}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Settings className="h-6 w-6" />
                Gerenciar: {competition.name}
              </h1>
              <p className="text-muted-foreground">
                Configure base de times, jogadores, participantes, partidas e pontuação
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Competição</CardTitle>
              <CardDescription>Edite o nome e a data de início.</CardDescription>
            </CardHeader>
            <CardContent>
              <EditCompetitionForm
                competitionId={competitionId}
                initialName={competition.name}
                initialStartDate={competition.startDate}
              />
            </CardContent>
          </Card>

          <Tabs defaultValue="matches">
            <TabsList>
              <TabsTrigger value="matches" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Partidas
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Resultados
              </TabsTrigger>
              <TabsTrigger value="base" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Base
              </TabsTrigger>
              <TabsTrigger value="scoring" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Pontuação
              </TabsTrigger>
            </TabsList>

            <TabsContent value="matches" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Adicionar Partida</CardTitle>
                  <CardDescription>Adicione uma nova partida à competição</CardDescription>
                </CardHeader>
                <CardContent>
                  <AddMatchForm competitionId={competitionId} teams={normalizedTeams} />
                </CardContent>
              </Card>

              {scheduledMatches.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Partidas Agendadas ({scheduledMatches.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {scheduledMatches.map((match) => (
                        <div
                          key={match.id}
                          className="flex items-center justify-between p-4 rounded-lg border"
                        >
                          <div className="flex items-center gap-4">
                            <span className="font-medium">
                              {match.homeTeam?.name || 'Time Casa'}
                            </span>
                            <span className="text-muted-foreground">vs</span>
                            <span className="font-medium">
                              {match.awayTeam?.name || 'Time Fora'}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(match.matchDate).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="results" className="mt-6 space-y-6">
              {normalizedMatches.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
                    <CardTitle className="text-lg mb-2">Nenhuma partida para atualizar</CardTitle>
                    <CardDescription>Não há partidas cadastradas ainda.</CardDescription>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Atualizar Resultados</CardTitle>
                    <CardDescription>
                      Insira o resultado das partidas finalizadas para calcular os pontos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {normalizedMatches.map((match) => (
                        <MatchResultForm key={match.id} match={match} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {finishedMatches.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Partidas Finalizadas ({finishedMatches.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {finishedMatches.map((match) => (
                        <div
                          key={match.id}
                          className="flex items-center justify-between rounded-lg border p-4"
                        >
                          <div className="flex items-center gap-4">
                            <span className="font-medium">{match.homeTeam?.name || 'Time Casa'}</span>
                            <span className="text-xl font-bold">
                              {match.homeScore} x {match.awayScore}
                            </span>
                            <span className="font-medium">{match.awayTeam?.name || 'Time Fora'}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">Finalizada</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="base" className="mt-6 space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Novo time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CreateTeamForm />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Novo jogador</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CreatePlayerForm teams={normalizedTeams} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Adicionar participante</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AddParticipantForm competitionId={competitionId} users={normalizedUsers} />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Times cadastrados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {normalizedTeams.map((team) => (
                    <EditableTeamRow key={team.id} team={team} />
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Jogadores cadastrados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {normalizedPlayers.map((player) => (
                    <EditablePlayerRow key={player.id} player={player} teams={normalizedTeams} />
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Participantes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {safeParticipants.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum participante ainda.</p>
                  ) : (
                    safeParticipants.map((participant) => (
                      <div
                        key={participant.user.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <span>{participant.user.name}</span>
                        <DeleteEntityButton
                          endpoint={`/competitions/${competitionId}/participants/${participant.user.id}`}
                          label="Remover"
                        />
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scoring" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recalcular pontuação</CardTitle>
                  <CardDescription>
                    Reprocessa todos os palpites, placares oficiais e atualiza o ranking.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecalculateRankingButton competitionId={competitionId} />
                </CardContent>
              </Card>

              <div className="space-y-6">
                {normalizedMatches.map((match) => (
                  <Card key={match.id}>
                    <CardHeader>
                      <CardTitle>
                        {match.homeTeam?.name || 'Time Casa'} x {match.awayTeam?.name || 'Time Fora'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <MatchResultForm match={match} />
                      <OfficialGoalsForm
                        matchId={match.id}
                        players={[...(match.homeTeam?.players ?? []), ...(match.awayTeam?.players ?? [])]}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
