import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { AddTeamForm } from './add-team-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield } from 'lucide-react'
import { getServerToken, serverApiRequest } from '@/lib/server-backend'

export default async function TeamsPage() {
  const token = await getServerToken()
  if (!token) redirect('/sign-in')

  let session
  let teams

  try {
    ;[session, teams] = await Promise.all([
      serverApiRequest<{ sub: number; login: string; role: 'ADMIN' | 'USUARIO'; name: string }>('/auth/me'),
      serverApiRequest<Array<{ id: number; name: string }>>('/teams'),
    ])
  } catch (error) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold">Times</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os times disponíveis para as competições
            </p>
          </div>

          {session.role === 'ADMIN' && (
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Time</CardTitle>
                <CardDescription>
                  Cadastre um novo time para usar nas competições
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AddTeamForm />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Times Cadastrados ({teams.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {teams.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhum time cadastrado ainda</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {teams.map((team) => (
                    <div
                      key={team.id}
                      className="flex items-center gap-4 p-4 rounded-lg border"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                        <Shield className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{team.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
