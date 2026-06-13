import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Users, Target, TrendingUp, Shield, Zap } from 'lucide-react'

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Bolão</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Entrar</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Criar Conta</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-balance">
            O Melhor Sistema de Bolão do Brasil
          </h1>
          <p className="mt-6 text-lg text-muted-foreground text-balance">
            Crie competições, convide seus amigos, faça palpites e acompanhe o ranking em tempo real.
            Simples, rápido e divertido.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/sign-up">
                Começar Agora
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/sign-in">
                Já tenho conta
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Recursos Poderosos</h2>
          <p className="mt-2 text-muted-foreground">
            Tudo que você precisa para organizar seu bolão
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Trophy className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Crie Competições</CardTitle>
              <CardDescription>
                Configure competições personalizadas para qualquer campeonato ou torneio.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Convide Amigos</CardTitle>
              <CardDescription>
                Compartilhe um código de convite simples para que seus amigos participem.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Target className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Faça Palpites</CardTitle>
              <CardDescription>
                Interface intuitiva para registrar seus palpites antes de cada partida.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Ranking em Tempo Real</CardTitle>
              <CardDescription>
                Acompanhe sua posição e dos outros participantes após cada rodada.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Sistema de Pontos Justo</CardTitle>
              <CardDescription>
                Pontuação equilibrada que valoriza placares exatos e resultados corretos.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Fácil de Usar</CardTitle>
              <CardDescription>
                Design moderno e responsivo que funciona perfeitamente em qualquer dispositivo.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How it Works */}
      <section className="container mx-auto px-4 py-24 bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Como Funciona</h2>
          <p className="mt-2 text-muted-foreground">
            Em 3 passos simples você já está participando
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
              1
            </div>
            <h3 className="font-semibold text-lg mb-2">Crie sua conta</h3>
            <p className="text-muted-foreground">
              Cadastro rápido com email e senha
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
              2
            </div>
            <h3 className="font-semibold text-lg mb-2">Entre em uma competição</h3>
            <p className="text-muted-foreground">
              Use um código de convite ou crie a sua própria
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
              3
            </div>
            <h3 className="font-semibold text-lg mb-2">Faça seus palpites</h3>
            <p className="text-muted-foreground">
              Registre seus palpites e acompanhe o ranking
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold">Pronto para começar?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Crie sua conta gratuitamente e comece a se divertir com seus amigos.
          </p>
          <Button size="lg" className="mt-8" asChild>
            <Link href="/sign-up">
              Criar Conta Grátis
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Bolão. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
