import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { CompetitionCard } from '@/components/competition-card'
import { CreateCompetitionDialog } from '@/components/create-competition-dialog'
import { JoinCompetitionDialog } from '@/components/join-competition-dialog'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Trophy, Globe } from 'lucide-react'
import { getServerToken, serverApiRequest } from '@/lib/server-backend'

export default async function CompetitionsPage() {
  const token = await getServerToken()
  if (!token) redirect('/sign-in')

  const competitions = await serverApiRequest<Array<{
    id: number
    name: string
    status: string
    startDate: string
    _count?: { participants: number; matches: number }
    myStanding?: { totalPoints: number } | null
    isParticipant?: boolean
  }>>('/competitions')

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Competições</h1>
              <p className="text-muted-foreground mt-1">Gerencie suas competições ou encontre novas</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <CreateCompetitionDialog />
              <JoinCompetitionDialog />
            </div>
          </div>

          <Tabs defaultValue="my-competitions">
            <TabsList>
              <TabsTrigger value="my-competitions" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Minhas Competições
              </TabsTrigger>
              <TabsTrigger value="public" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Visíveis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="my-competitions" className="mt-6">
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
            </TabsContent>

            <TabsContent value="public" className="mt-6">
              {competitions.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Globe className="h-12 w-12 text-muted-foreground mb-4" />
                    <CardTitle className="text-lg mb-2">Nenhuma competição disponível</CardTitle>
                    <CardDescription className="text-center max-w-md">
                      Não há competições visíveis no momento.
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
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
