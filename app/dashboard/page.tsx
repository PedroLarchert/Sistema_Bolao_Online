import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { CompetitionCard } from '@/components/competition-card'
import { CreateCompetitionDialog } from '@/components/create-competition-dialog'
import { JoinCompetitionDialog } from '@/components/join-competition-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Target, Award } from 'lucide-react'
import { getServerToken, serverApiRequest } from '@/lib/server-backend'

export default async function DashboardPage() {
  const token = await getServerToken()
  if (!token) redirect('/sign-in')

  let session
  let competitions

  try {
    ;[session, competitions] = await Promise.all([
      serverApiRequest<{ sub: number; login: string; role: 'ADMIN' | 'USUARIO'; name: string }>('/auth/me'),
      serverApiRequest<Array<{
        id: number
        name: string
        status: string
        startDate: string
        _count?: { participants: number; matches: number }
        myStanding?: { totalPoints: number } | null
        isParticipant?: boolean
      }>>('/competitions'),
    ])
  } catch (error) {
    redirect('/sign-in')
  }

  const totalPoints = competitions.reduce((sum, competition) => sum + (competition.myStanding?.totalPoints || 0), 0)
  const activeCompetitions = competitions.filter((competition) => competition.status === 'ACTIVE').length

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold">Olá, {session.name}!</h1>
            <p className="text-muted-foreground mt-1">
              Bem-vindo ao seu painel de bolões
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Competições Ativas</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeCompetitions}</div>
                <p className="text-xs text-muted-foreground">de {competitions.length} total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Pontos</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPoints}</div>
                <p className="text-xs text-muted-foreground">em todas as competições</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Participações</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{competitions.length}</div>
                <p className="text-xs text-muted-foreground">competições visíveis para você</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap gap-4">
            <CreateCompetitionDialog />
            <JoinCompetitionDialog />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Suas Competições</h2>

            {competitions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
                  <CardTitle className="text-lg mb-2">Nenhuma competição ainda</CardTitle>
                  <CardDescription className="text-center max-w-md">
                    Crie uma nova competição ou entre em uma existente pelo ID.
                  </CardDescription>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {competitions.map((competition) => (
                  <CompetitionCard key={competition.id} competition={competition} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
