'use client'

import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { mockAtletas, mockClubes, mockCampeonatos } from '@/mocks/database'
import { useAuth } from '@/hooks/use-auth'
import type { Atleta, Campeonato, Clube } from '@/types'
import { tipoJogoInfos } from '@/lib/jogo-config'


const statusBadgeColor: Record<string, string> = {
  ativo: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  inativo: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  finalizado: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
}

export default function CampeonatoDetalhePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const campeonato = (mockCampeonatos as Campeonato[]).find((camp) => camp.id === Number(id))

  if (!campeonato) {
    return <div className="p-6">Campeonato não encontrado</div>
  }

  const isOwner = campeonato.idUsuario === user?.id
  const clubes = (mockClubes as Clube[]).filter((clube) => clube.idCampeonato === campeonato.id)
  const atletas = (mockAtletas as Atleta[]).filter((atleta) => clubes.some((clube) => clube.id === atleta.idClube))
  const tipoInfo = tipoJogoInfos[campeonato.tipoJogo]
  const statusAtual = campeonato.status ?? 'ativo'

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/campeonatos')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-display font-bold">{campeonato.nome}</h1>
            <p className="text-muted-foreground">
              {campeonato.descricao || 'Detalhes do campeonato e seus participantes.'}
            </p>
          </div>
        </div>

        {isOwner && (
          <Button onClick={() => navigate(`/campeonatos/${campeonato.id}/gerenciar`)} size="lg">
            <Settings className="mr-2 h-4 w-4" />
            Gerenciar
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tipo de Jogo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{tipoInfo.label}</p>
            <p className="text-xs text-muted-foreground mt-1">{tipoInfo.jogadores} jogadores por time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className={`text-xs border ${statusBadgeColor[statusAtual]}`}>
              {statusAtual === 'ativo' ? 'Ativo' : statusAtual === 'finalizado' ? 'Finalizado' : 'Inativo'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Clubes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{clubes.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Atletas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{atletas.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clubes</CardTitle>
          <CardDescription>Listagem dos clubes do campeonato.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Clube</TableHead>
                <TableHead className="text-right">Atletas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clubes.map((clube) => {
                const atletaCount = atletas.filter((atleta) => atleta.idClube === clube.id).length
                return (
                  <TableRow key={clube.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {clube.logo ? (
                          <Avatar>
                            <AvatarImage src={clube.logo} alt={clube.nome} />
                            <AvatarFallback>{clube.nome.charAt(0)}</AvatarFallback>
                          </Avatar>
                        ) : (
                          <Avatar>
                            <AvatarFallback>{clube.nome.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                        <span>{clube.nome}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{atletaCount}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
