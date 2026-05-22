'use client'

import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Trophy, Medal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { mockLigas, mockCampeonatos, mockEquipeLiga, mockEquipesFantasy, mockUsuarios, mockRegraPontuacaoLiga, mockDesempenhoEquipeFantasy, mockDesempenhoAtleta, mockRodadas, mockClubes, mockAtletas } from '@/mocks/database'
import { useAuth } from '@/hooks/use-auth'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

export default function LigaDetalhe() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)
  const [tipoRanking, setTipoRanking] = useState<'geral' | 'rodada'>('geral')
  const [rodadaSelecionada, setRodadaSelecionada] = useState<number | 'todas'>('todas')
  const [isJoining, setIsJoining] = useState(false)
  const [joinCode, setJoinCode] = useState('')
  const [joinError, setJoinError] = useState('')
  const [joined, setJoined] = useState(false)

  const ligaBase = mockLigas.find(l => l.id === Number(id)) as any
  const liga = {
    ...ligaBase,
    descricao: ligaBase?.descricao,
    campeonatoNome: mockCampeonatos.find(c => c.id === ligaBase?.idCampeonato)?.nome ?? ''
  }

  if (!liga) {
    return <div className="p-6">Liga não encontrada</div>
  }

  const equipesLiga = mockEquipeLiga.filter(el => el.idLiga === liga.id)
  const rodasLiga = mockRodadas.filter(r => r.idCampeonato === liga.idCampeonato)
  const rodadaAtual = rodasLiga.length > 0 ? rodasLiga[rodasLiga.length - 1].numero : 1

  const participantes = equipesLiga.map(equipeLiga => {
    const equipeFantasy = mockEquipesFantasy.find(e => e.id === equipeLiga.idEquipeFantasy)!
    const usuario = mockUsuarios.find(u => u.id === equipeFantasy.idUsuario)!
    const desempenhos = mockDesempenhoEquipeFantasy.filter(d => d.idEquipeFantasy === equipeLiga.idEquipeFantasy && d.idLiga === liga.id)

    const pontuacoesPorRodada: { [key: number]: number } = {}
    desempenhos.forEach(d => {
      pontuacoesPorRodada[d.idRodada] = (d.pontuacaoRodada || 0)
    })

    return {
      id: equipeLiga.id,
      nomeEquipe: equipeFantasy.nome,
      logoEquipe: equipeFantasy.logo,
      nomeUsuario: usuario.nome,
      idEquipeFantasy: equipeFantasy.id,
      pontuacoesPorRodada,
      pontuacaoTotal: equipeLiga.pontuacaoTotal || 0,
      patrimonio: equipeLiga.patrimonio
    }
  })
  const isOwner = liga.idUsuarioCriador === user?.id
  const userEquipeFantasy = user ? mockEquipesFantasy.find((equipe) => equipe.idUsuario === user.id) : undefined
  const isMember = Boolean(
    userEquipeFantasy &&
      mockEquipeLiga.some(
        (entry) => entry.idLiga === liga.id && entry.idEquipeFantasy === userEquipeFantasy.id
      )
  )
  const hasAccess = isOwner || isMember || joined

  const handleJoinLiga = () => {
    if (joinCode.trim() === liga.codigoAcesso) {
      setJoined(true)
      setJoinError('')
      setIsJoining(false)
      setJoinCode('')
      return
    }

    setJoinError('Código de acesso inválido')
  }

  // Funções de cálculo
  const getPontuacaoRodada = (p: any, rodada: number) => p.pontuacoesPorRodada[rodada] || 0
  const getPontuacaoTotal = (p: any) => p.pontuacaoTotal

  const participantesRanqueados = tipoRanking === 'geral'
    ? [...participantes].sort((a, b) => getPontuacaoTotal(b) - getPontuacaoTotal(a))
    : [...participantes].sort((a, b) =>
        getPontuacaoRodada(b, rodadaSelecionada === 'todas' ? rodadaAtual : Number(rodadaSelecionada)) -
        getPontuacaoRodada(a, rodadaSelecionada === 'todas' ? rodadaAtual : Number(rodadaSelecionada))
      )

  const destaqueRodada = participantesRanqueados[0]
  const usuario = participantes.find(p => p.idEquipeFantasy === mockEquipesFantasy.find(e => e.idUsuario === user?.id)?.id)

  const handleCopyCode = () => {
    if (liga?.codigoAcesso) {
      navigator.clipboard.writeText(liga.codigoAcesso)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getMedalColor = (posicao: number) => {  
    switch (posicao) {
      case 1: return 'text-yellow-400'
      case 2: return 'text-gray-400'
      case 3: return 'text-amber-600'
      default: return 'text-muted-foreground'
    }
  }

  // AGRUPAR ESTATÍSTICAS DOS ATLETAS
  const desempenhoAgrupado = Object.values(
    mockDesempenhoAtleta.reduce((acc, desempenho) => {

      // filtra por rodada quando estiver em "rodada"
      if (
        tipoRanking === 'rodada' &&
        rodadaSelecionada !== 'todas' &&
        desempenho.idRodada !== Number(rodadaSelecionada)
      ) {
        return acc
      }

      const atletaId = desempenho.idAtleta

      if (!acc[atletaId]) {
        acc[atletaId] = {
          ...desempenho
        }
      } else {
        acc[atletaId].gols += desempenho.gols
        acc[atletaId].assistencias += desempenho.assistencias
        acc[atletaId].finalizacoes += desempenho.finalizacoes
        acc[atletaId].driblesSimples += desempenho.driblesSimples
        acc[atletaId].caneta += desempenho.caneta
        acc[atletaId].cartoesAmarelos += desempenho.cartoesAmarelos
        acc[atletaId].cartoesVermelhos += desempenho.cartoesVermelhos
        acc[atletaId].pontosCalculados += desempenho.pontosCalculados
      }

      return acc
    }, {} as Record<number, any>)
  )

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        {/* ESQUERDA */}
        <div className="flex items-center gap-4">
          <Link to="/ligas">
            <Button variant="ghost" size="icon">
              <ArrowLeft />
            </Button>
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{liga.nome}</h1>
              {isOwner && <Badge variant="secondary">Criador</Badge>}
            </div>
            <p className="text-md text-muted-foreground mb-4">{liga.campeonatoNome}</p>
            <p className="text-sm text-muted-foreground max-w-2xl mt-1">
              {liga.descricao || 'Visualize os detalhes da liga antes de entrar.'}
            </p>
            <p className="text-lg font-bold text-muted-foreground mt-2">
              Participantes: {participantes.length}/{liga.maxParticipantes}
            </p>
          </div>
        </div>

        {/* DIREITA */}
        <div className="flex gap-2 flex-wrap">
          {isOwner && (
            <Button variant="outline" onClick={handleCopyCode}>
              {copied ? 'Copiado!' : `Código: ${liga.codigoAcesso}`}
            </Button>
          )}

          {isOwner && (
            <Button
              variant="outline"
              onClick={() => navigate(`/ligas/${id}/gerenciar`)}
            >
              Gerenciar
            </Button>
          )}

          {hasAccess ? (
            <Button onClick={() => navigate(`/dashboard/escalacao/${id}`)}>
              Escalar Time
            </Button>
          ) : (
            <Button onClick={() => setIsJoining(true)}>
              Entrar na Liga
            </Button>
          )}
        </div>
      </div>

      {!hasAccess && isJoining && (
        <Card>
          <CardHeader>
            <CardTitle>Entrar na Liga</CardTitle>
            <CardDescription>
              Digite o código de acesso para participar desta liga.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-[1fr_auto] items-end">
            <div>
              <Label htmlFor="codigoAcesso">Código de Acesso</Label>
              <Input
                id="codigoAcesso"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Ex: ABC123"
              />
              {joinError && <p className="text-sm text-destructive mt-2">{joinError}</p>}
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={handleJoinLiga}>Confirmar Entrada</Button>
              <Button variant="outline" onClick={() => setIsJoining(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TABS */}
      <Tabs defaultValue="classificacao" className="space-y-6">
        <TabsList>
          <TabsTrigger value="classificacao">Classificação</TabsTrigger>
          <TabsTrigger value="regras">Regras</TabsTrigger>
          <TabsTrigger value="scouts">Scouts</TabsTrigger>
        </TabsList>

        {/* CLASSIFICAÇÃO */}
        <TabsContent value="classificacao">

          {/* CARDS */}
          <div className="grid md:grid-cols-5 gap-4 mb-6">

            <div className="p-4 bg-muted rounded">
              <p className="text-sm">🔥 Destaque</p>
              <p className="font-bold">{destaqueRodada?.nomeEquipe}</p>
              <p className='text-xl font-bold text-green-400'>{tipoRanking === 'geral' ? destaqueRodada?.pontuacaoTotal : getPontuacaoRodada(destaqueRodada, rodadaSelecionada === 'todas' ? rodadaAtual : Number(rodadaSelecionada))} pts</p>
            </div>

            {usuario && (
              <>
                <div className="p-4 bg-muted rounded">
                  <p className="text-sm">Sua posição</p>
                  <p className="text-2xl font-bold">#{participantesRanqueados.findIndex(p => p.id === usuario.id) + 1}</p>
                </div>

                <div className="p-4 bg-muted rounded">
                  <p className="text-sm">Sua pontuação</p>
                  <p className="text-xl font-bold text-green-400">
                    {tipoRanking === 'geral' ? usuario.pontuacaoTotal : getPontuacaoRodada(usuario, rodadaSelecionada === 'todas' ? rodadaAtual : Number(rodadaSelecionada))} pts
                  </p>
                </div>

                <div className="p-4 bg-muted rounded">
                  <p className="text-sm">Patrimônio</p>
                  <p className="text-xl font-bold">
                    C$ {usuario.patrimonio}
                  </p>
                </div>

                <div className="p-4 bg-muted rounded">
                  <p className="text-sm">Equipe</p>
                  <p className="text-lg font-bold text-primary">{usuario.nomeEquipe}</p>
                </div>
              </>
            )}

          </div>

          {/* FILTRO */}
          <div className="flex gap-2 mb-4 items-center flex-wrap">
            <Button
              variant={tipoRanking === 'geral' ? 'default' : 'outline'}
              onClick={() => setTipoRanking('geral')}
            >
              Geral
            </Button>

            <Button
              variant={tipoRanking === 'rodada' ? 'default' : 'outline'}
              onClick={() => setTipoRanking('rodada')}
            >
              Rodada
            </Button>

            {tipoRanking === 'rodada' && (
              <Select value={rodadaSelecionada.toString()} onValueChange={(v) => setRodadaSelecionada(v === 'todas' ? 'todas' : Number(v))}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {rodasLiga.map(rodada => (
                    <SelectItem key={rodada.id} value={rodada.numero.toString()}>
                      Rodada {rodada.numero}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* TABELA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Ranking da Liga
              </CardTitle>
              <CardDescription>
                Classificação dos participantes
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pos</TableHead>
                    <TableHead>Logo</TableHead>
                    <TableHead>Equipe</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead className="text-right">Pontos</TableHead>
                    <TableHead className="text-right">Patrimônio</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {participantesRanqueados.map((p, idx) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        {idx + 1 <= 3 ? (
                          <Medal className={`h-5 w-5 ${getMedalColor(idx + 1)}`} />
                        ) : (
                          idx + 1
                        )}
                      </TableCell>

                      <TableCell>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={p.logoEquipe} alt={p.nomeEquipe} />
                          <AvatarFallback>{p.nomeEquipe.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </TableCell>

                      <TableCell className="font-bold">{p.nomeEquipe}</TableCell>
                      <TableCell>{p.nomeUsuario}</TableCell>

                      <TableCell className="text-right font-bold text-primary">
                        {tipoRanking === 'geral'
                          ? p.pontuacaoTotal
                          : getPontuacaoRodada(p, rodadaSelecionada === 'todas' ? rodadaAtual : Number(rodadaSelecionada))}
                      </TableCell>

                      <TableCell className="text-right">
                        C$ {p.patrimonio}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* REGRAS */}
        <TabsContent value="regras">
          <Card>
            <CardHeader>
              <CardTitle>Regras da Liga</CardTitle>
              <CardDescription>
                Sistema de pontuação e configurações
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {mockRegraPontuacaoLiga.filter(r => r.idLiga === liga.id).length > 0 ? (
                <div>
                  <h3 className="font-semibold mb-3">Sistema de Pontuação</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {mockRegraPontuacaoLiga.filter(r => r.idLiga === liga.id).map((regra) => {
                      const acaoIcones: { [key: string]: string } = {
                        'GOLS': '⚽',
                        'ASSISTENCIAS': '🎯',
                        'CARTOES_AMARELOS': '🟨',
                        'CARTOES_VERMELHOS': '🟥',
                        'FINALIZACOES': '🔫',
                        'IMPEDIMENTOS': '⚠️',
                        'FALTAS_COMETIDAS': '🙅',
                        'FALTAS_RECEBIDAS': '👂',
                        'CANETAS': '🍌',
                        'CHAPEUS': '🎩',
                        'DRIBLES_SIMPLES': '🎪'
                      }
                      const acaoLabels: { [key: string]: string } = {
                        'GOLS': 'Gol',
                        'ASSISTENCIAS': 'Assistência',
                        'CARTOES_AMARELOS': 'Cartão amarelo',
                        'CARTOES_VERMELHOS': 'Cartão vermelho',
                        'FINALIZACOES': 'Finalização',
                        'IMPEDIMENTOS': 'Impedimento',
                        'FALTAS_COMETIDAS': 'Falta cometida',
                        'FALTAS_RECEBIDAS': 'Falta recebida',
                        'CANETAS': 'Caneta',
                        'CHAPEUS': 'Chapéu',
                        'DRIBLES_SIMPLES': 'Drible'
                      }
                      const isNegative = regra.valor < 0
                      return (
                        <div key={regra.id} className="p-3 bg-muted rounded flex justify-between items-center">
                          <span>{acaoIcones[regra.acao] || '•'} {acaoLabels[regra.acao] || regra.acao}</span>
                          <span className={`font-bold ${isNegative ? 'text-red-400' : 'text-green-400'}`}>
                            {isNegative ? '' : '+'}{regra.valor}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Nenhuma regra configurada para esta liga.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SCOUTS */}
        <TabsContent value="scouts">
          <div className="space-y-6">
            {/* FILTRO DE RODADA */}
            <div className="flex gap-2 items-center flex-wrap">
              <Button
                variant={tipoRanking === 'geral' ? 'default' : 'outline'}
                onClick={() => setTipoRanking('geral')}
              >
                Geral
              </Button>

              <Button
                variant={tipoRanking === 'rodada' ? 'default' : 'outline'}
                onClick={() => setTipoRanking('rodada')}
              >
                Rodada
              </Button>

              {tipoRanking === 'rodada' && (
                <Select value={rodadaSelecionada.toString()} onValueChange={(v) => setRodadaSelecionada(v === 'todas' ? 'todas' : Number(v))}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {rodasLiga.map(rodada => (
                      <SelectItem key={rodada.id} value={rodada.numero.toString()}>
                        Rodada {rodada.numero}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* TABELA DE ARTILHARIA */}
            <Card>
              <CardHeader>
                <CardTitle>Artilharia</CardTitle>
                <CardDescription>Gols marcados pelos atletas</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Atleta</TableHead>
                      <TableHead>Clube</TableHead>
                      <TableHead className="text-right">Gols</TableHead>
                      <TableHead className="text-right">Assistências</TableHead>
                      <TableHead className="text-right">Finalizações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {desempenhoAgrupado
                      .sort((a, b) => b.gols - a.gols)
                      .map((desempenho) => {
                        const atleta = mockAtletas.find(a => a.id === desempenho.idAtleta)
                        const clube = mockClubes.find(c => c.id === atleta?.idClube)
                        return (
                          <TableRow key={desempenho.id}>
                            <TableCell className="font-medium">{atleta?.nome}</TableCell>
                            <TableCell>{clube?.nome}</TableCell>
                            <TableCell className="text-right font-bold text-primary">{desempenho.gols}</TableCell>
                            <TableCell className="text-right">{desempenho.assistencias}</TableCell>
                            <TableCell className="text-right">{desempenho.finalizacoes}</TableCell>
                          </TableRow>
                        )
                      })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* TABELA DE ESTATÍSTICAS COMPLETAS */}
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas Completas</CardTitle>
                <CardDescription>Desempenho geral dos atletas</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Atleta</TableHead>
                      <TableHead className="text-right">Gols</TableHead>
                      <TableHead className="text-right">Assist</TableHead>
                      <TableHead className="text-right">Dribles</TableHead>
                      <TableHead className="text-right">Canetas</TableHead>
                      <TableHead className="text-right">Cartões</TableHead>
                      <TableHead className="text-right">Pontos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {desempenhoAgrupado
                      .sort((a, b) => b.pontosCalculados - a.pontosCalculados)
                      .map((desempenho) => {
                        const atleta = mockAtletas.find(a => a.id === desempenho.idAtleta)
                        const cartoes = desempenho.cartoesAmarelos + desempenho.cartoesVermelhos
                        return (
                          <TableRow key={desempenho.id}>
                            <TableCell className="font-medium">{atleta?.nome}</TableCell>
                            <TableCell className="text-right">{desempenho.gols}</TableCell>
                            <TableCell className="text-right">{desempenho.assistencias}</TableCell>
                            <TableCell className="text-right">{desempenho.driblesSimples}</TableCell>
                            <TableCell className="text-right">{desempenho.caneta}</TableCell>
                            <TableCell className="text-right text-red-400">{cartoes}</TableCell>
                            <TableCell className="text-right font-bold text-primary">{desempenho.pontosCalculados}</TableCell>
                          </TableRow>
                        )
                      })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  )
}