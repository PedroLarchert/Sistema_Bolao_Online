'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Trophy, MoreVertical, Copy, Settings, Trash2, LogOut, Play, Square, Check } from 'lucide-react'
import { updateCompetition, deleteCompetition, leaveCompetition } from '@/app/actions/competitions'

type Competition = {
  id: number
  name: string
  description: string | null
  type: string
  status: string
  inviteCode: string | null
  isPublic: boolean | null
  userRole?: string
  isParticipant?: boolean
}

export function CompetitionHeader({
  competition,
  isAdmin,
  isParticipant,
}: {
  competition: Competition
  isAdmin: boolean
  isParticipant?: boolean
}) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  const statusColors: Record<string, string> = {
    draft: 'bg-muted text-muted-foreground',
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    finished: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
  }

  const statusLabels: Record<string, string> = {
    draft: 'Rascunho',
    active: 'Ativo',
    finished: 'Finalizado',
  }

  const handleCopyCode = async () => {
    if (!competition.inviteCode) return
    await navigator.clipboard.writeText(competition.inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true)
    try {
      await updateCompetition(competition.id, { status: newStatus })
      router.refresh()
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteCompetition(competition.id)
      router.push('/dashboard')
    } catch (error) {
      console.error('Error deleting:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLeave = async () => {
    setLoading(true)
    try {
      await leaveCompetition(competition.id)
      router.push('/dashboard')
    } catch (error) {
      console.error('Error leaving:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Trophy className="h-6 w-6 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold">{competition.name}</h1>
            <Badge className={statusColors[competition.status]} variant="secondary">
              {statusLabels[competition.status]}
            </Badge>
          </div>
          {competition.description && (
            <p className="text-muted-foreground mt-1">{competition.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {competition.inviteCode && (
          <Button variant="outline" size="sm" onClick={handleCopyCode}>
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                {competition.inviteCode}
              </>
            )}
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isAdmin && (
              <>
                <DropdownMenuItem asChild>
                  <a href={`/competitions/${competition.id}/admin`}>
                    <Settings className="mr-2 h-4 w-4" />
                    Gerenciar
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {competition.status === 'draft' && (
                  <DropdownMenuItem onClick={() => handleStatusChange('active')}>
                    <Play className="mr-2 h-4 w-4" />
                    Iniciar Competição
                  </DropdownMenuItem>
                )}
                {competition.status === 'active' && (
                  <DropdownMenuItem onClick={() => handleStatusChange('finished')}>
                    <Square className="mr-2 h-4 w-4" />
                    Finalizar Competição
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </DropdownMenuItem>
              </>
            )}
            {!isAdmin && isParticipant && (
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setShowLeaveDialog(true)}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair da Competição
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir competição?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Todos os dados da competição, incluindo
              partidas, palpites e rankings serão permanentemente excluídos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={loading}>
              {loading ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sair da competição?</AlertDialogTitle>
            <AlertDialogDescription>
              Você perderá todos os seus palpites e pontos nesta competição.
              Você poderá entrar novamente usando o código de convite.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleLeave} disabled={loading}>
              {loading ? 'Saindo...' : 'Sair'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
