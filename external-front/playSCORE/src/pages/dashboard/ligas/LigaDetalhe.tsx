'use client'

import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Trophy, Medal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

import { useAuth } from '@/hooks/use-auth'
import api from '@/lib/api'

export default function LigaDetalhe() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()

  const [league, setLeague] = useState<any>(null)
  const [campeonatos, setCampeonatos] = useState<any[]>([])
  const [equipesLiga, setEquipesLiga] = useState<any[]>([])
  const [equipesFantasy, setEquipesFantasy] = useState<any[]>([])
  const [desempenhoEquipeFantasy, setDesempenhoEquipeFantasy] = useState<any[]>([])
  const [rodadas, setRodadas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isJoining, setIsJoining] = useState(false)
  const [joinCode, setJoinCode] = useState('')
  const [joinError, setJoinError] = useState('')
  const [copied, setCopied] = useState(false)
  const [tipoRanking, setTipoRanking] = useState<'geral' | 'rodada'>('geral')
  const [rodadaSelecionada, setRodadaSelecionada] = useState<number | 'todas'>('todas')
  const [isJoiningSubmit, setIsJoiningSubmit] = useState(false)
  const [desempenhoAtletas, setDesempenhoAtletas] = useState<any[]>([])
  const [regrasPontuacaoLiga, setRegrasPontuacaoLiga] = useState<any[]>([])

  useEffect(() => {
    const loadData = async () => {
      if (!id) return
      setLoading(true)

      try {
        const [currentLeague, campeonatosData, equipeLigaData, equipesFantasyData, desempenhoData, rodadasData, desempenhoAtletaData, desempenhoAtletaLigaData, regrasPontuacaoLigaData] = await Promise.all([
          api.getLiga(Number(id)),
          api.listCampeonatos(),
          api.listEquipeLiga(),
          api.listEquipesFantasy(),
          api.listDesempenhoEquipeFantasy(),
          api.listRodadas(),
          api.listDesempenhoAtleta(),
          api.listDesempenhoAtletaLiga(),
          api.listRegraPontuacaoLiga(),
        ])

        setLeague(currentLeague)
        setCampeonatos(campeonatosData)
        setEquipesLiga(equipeLigaData.filter((entry: any) => entry.idLiga === Number(id)))
        setEquipesFantasy(equipesFantasyData)
        setDesempenhoEquipeFantasy(desempenhoData)
        setRodadas(rodadasData)

        const desempenhoLigaMap = new Map<number, any>()
        ;(desempenhoAtletaLigaData || []).forEach((item: any) => {
          const desempenhoAtletaId = item.desempenhoAtleta?.id
          if (desempenhoAtletaId != null) {
            desempenhoLigaMap.set(desempenhoAtletaId, item)
          }
        })

        setDesempenhoAtletas(
          (desempenhoAtletaData || []).map((raw: any) => {
            const ligaItem = desempenhoLigaMap.get(raw.id)
            return {
              ...raw,
              pontosCalculados: ligaItem?.pontosCalculados ?? 0,
              valorAnterior: ligaItem?.valorAnterior ?? 0,
              valorAtual: ligaItem?.valorAtual ?? 0,
              valorAtualizado: ligaItem?.valorAtualizado ?? 0,
              rodada: raw.rodada || ligaItem?.rodada,
              atleta: raw.atleta || ligaItem?.desempenhoAtleta?.atleta,
            }
          })
        )
        setRegrasPontuacaoLiga(regrasPontuacaoLigaData)
      } catch (error) {
        console.error('Erro ao carregar detalhes da liga', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  const campeonato = useMemo(
    () => campeonatos.find((camp) => camp.id === league?.idCampeonato),
    [campeonatos, league]
  )

  const userTeam = useMemo(
    () => equipesFantasy.find((team) => team.criador?.id === user?.id),
    [equipesFantasy, user]
  )

  const userEntry = useMemo(
    () => userTeam && equipesLiga.find((entry) => entry.idEquipeFantasy === userTeam.id),
    [equipesLiga, userTeam]
  )

  const regrasDaLiga = useMemo(
    () => regrasPontuacaoLiga.filter((regra) => regra.liga?.id === Number(id)),
    [regrasPontuacaoLiga, id]
  )

  console.log('user', user)

  console.log('userTeam', userTeam)

  console.log('equipesLiga', equipesLiga)

  console.log('userEntry', userEntry)

  const isOwner = league?.idUsuarioCriador === user?.id
  const hasAccess = Boolean(userEntry)

  const rodadaOptions = useMemo(
    () => rodadas.filter((rodada) => rodada.campeonato?.id === league?.idCampeonato),
    [rodadas, league]
  )

  const rodadaIdSelecionada = useMemo(() => {
    if (rodadaSelecionada === 'todas') return null
    const rodada = rodadaOptions.find((item) => item.numero === rodadaSelecionada)
    return rodada?.id ?? null
  }, [rodadaOptions, rodadaSelecionada])

  const ranking = useMemo(() => {
    return equipesLiga
      .map((entry) => {
        const team = equipesFantasy.find((teamItem) => teamItem.id === entry.idEquipeFantasy)
        const pontuacaoRodada =
          rodadaSelecionada === 'todas'
            ? Number(entry.pontuacaoTotal || 0)
            : desempenhoEquipeFantasy
              .filter(
                (desempenho) =>
                  desempenho.equipeLiga?.id === entry.id &&
                  desempenho.rodada?.id === rodadaIdSelecionada
              )
              .reduce(
                (sum, desempenho) =>
                  sum + (desempenho.pontuacaoRodada || 0),
                0
              )

        return {
          ...entry,
          nomeEquipe: team?.nome || 'Equipe sem nome',
          logoEquipe: team?.logo || '',
          usuarioId: team?.criador?.id,
          nomeUsuario: team?.criador?.nome || 'Usuário desconhecido',
          pontuacaoTotal: Number(entry.pontuacaoTotal || 0),
          pontuacaoRodada,
          patrimonio: Number(entry.patrimonio || 0),
        }
      })
      .sort((a, b) => {
        if (tipoRanking === 'rodada') {
          return b.pontuacaoRodada - a.pontuacaoRodada
        }
        return b.pontuacaoTotal - a.pontuacaoTotal
      })
  }, [equipesLiga, equipesFantasy, desempenhoEquipeFantasy, tipoRanking, rodadaIdSelecionada])

  const desempenhoAgrupado = useMemo(() => {
    return Object.values(
      desempenhoAtletas.reduce((acc: any, desempenho: any) => {
        if (!desempenho?.atleta?.id) {
          return acc
        }

        if (
          tipoRanking === 'rodada' &&
          rodadaSelecionada !== 'todas' &&
          desempenho.rodada?.id !== rodadaIdSelecionada
        ) {
          return acc
        }

        const atletaId = desempenho.atleta.id
        if (!acc[atletaId]) {
          acc[atletaId] = {
            id: atletaId,
            atleta: desempenho.atleta,
            gols: desempenho.gols || 0,
            assistencias: desempenho.assistencias || 0,
            finalizacoes: desempenho.finalizacoes || 0,
            driblesSimples: desempenho.driblesSimples || 0,
            caneta: desempenho.caneta || 0,
            cartoesAmarelos: desempenho.cartoesAmarelos || 0,
            cartoesVermelhos: desempenho.cartoesVermelhos || 0,
            pontosCalculados: desempenho.pontosCalculados || 0,
            valorAtualizado: desempenho.valorAtualizado || 0,
            rodada: desempenho.rodada,
          }
        } else {
          acc[atletaId].gols += desempenho.gols || 0
          acc[atletaId].assistencias += desempenho.assistencias || 0
          acc[atletaId].finalizacoes += desempenho.finalizacoes || 0
          acc[atletaId].driblesSimples += desempenho.driblesSimples || 0
          acc[atletaId].caneta += desempenho.caneta || 0
          acc[atletaId].cartoesAmarelos += desempenho.cartoesAmarelos || 0
          acc[atletaId].cartoesVermelhos += desempenho.cartoesVermelhos || 0
          acc[atletaId].pontosCalculados += desempenho.pontosCalculados || 0
        }

        return acc
      }, {})
    )
  }, [desempenhoAtletas, tipoRanking, rodadaSelecionada, rodadaIdSelecionada])

  const topTeam = ranking[0]

  const handleCopyCode = () => {
    if (!league?.codigoAcesso) return
    navigator.clipboard.writeText(league.codigoAcesso)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleJoinLiga = async () => {
    setJoinError('')

    if (!league) return
    if (!userTeam) {
      setJoinError('Crie um time fantasy antes de entrar na liga.')
      return
    }

    if (joinCode.trim().toUpperCase() !== league.codigoAcesso?.toUpperCase()) {
      setJoinError('Código de acesso inválido.')
      return
    }

    setIsJoiningSubmit(true)
    try {
      const newEntry = await api.createEquipeLiga({
        idLiga: league.id,
        idEquipeFantasy: userTeam.id,
        patrimonio: Number(userTeam.patrimonio || 100),
      })
      setEquipesLiga((prev) => [...prev, newEntry])
      setIsJoining(false)
      setJoinCode('')
    } catch (error) {
      console.error('Erro ao entrar na liga', error)
      setJoinError('Não foi possível entrar na liga. Tente novamente.')
    } finally {
      setIsJoiningSubmit(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-12">Carregando...</div>
  }

  if (!league) {
    return <div className="flex items-center justify-center py-12">Liga não encontrada</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/ligas">
            <Button variant="ghost" size="icon">
              <ArrowLeft />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{league.nome}</h1>
              {isOwner && <Badge variant="secondary">Criador</Badge>}
            </div>
            <p className="text-md text-muted-foreground mb-4">{campeonato?.nome || 'Campeonato não encontrado'}</p>
            <p className="text-sm text-muted-foreground max-w-2xl mt-1">
              {league.descricao || 'Visualize os detalhes da liga antes de entrar.'}
            </p>
            <p className="text-lg font-bold text-muted-foreground mt-2">
              Participantes: {equipesLiga.length}/{league.maximoParticipantes}
            </p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {isOwner && (
            <Button variant="outline" onClick={handleCopyCode}>
              {copied ? 'Copiado!' : `Código: ${league.codigoAcesso}`}
            </Button>
          )}
          {isOwner && (
            <Button variant="outline" onClick={() => navigate(`/ligas/${id}/gerenciar`)}>
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
            <CardDescription>Digite o código de acesso para participar desta liga.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-[1fr_auto] items-end">
            <div>
              <Label htmlFor="codigoAcesso">Código de Acesso</Label>
              <Input
                id="codigoAcesso"
                value={joinCode}
                onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
                placeholder="Ex: ABC123"
              />
              {joinError && <p className="text-sm text-destructive mt-2">{joinError}</p>}
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={handleJoinLiga} disabled={isJoiningSubmit}>
                {isJoiningSubmit ? 'Entrando...' : 'Confirmar Entrada'}
              </Button>
              <Button variant="outline" onClick={() => setIsJoining(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isJoining && !userTeam && (
        <Card>
          <CardContent>
            <p className="text-muted-foreground">
              Você precisa criar um time fantasy antes de entrar em uma liga.
            </p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="classificacao" className="space-y-6">
        <TabsList>
          <TabsTrigger value="classificacao">Classificação</TabsTrigger>
          <TabsTrigger value="regras">Regras</TabsTrigger>
          <TabsTrigger value="scouts">Scouts</TabsTrigger>
        </TabsList>

        <TabsContent value="classificacao">
          <div className="grid md:grid-cols-5 gap-4 mb-6">
            <div className="p-4 bg-muted rounded">
              <p className="text-sm">🔥 Destaque</p>
              <p className="font-bold">{topTeam?.nomeEquipe || 'Sem participantes'}</p>
              <p className="text-xl font-bold text-green-400">
                {tipoRanking === 'geral' ? topTeam?.pontuacaoTotal ?? 0 : topTeam?.pontuacaoRodada ?? 0} pts
              </p>
            </div>

            {hasAccess && (
              <>
                <div className="p-4 bg-muted rounded">
                  <p className="text-sm">Sua posição</p>
                  <p className="text-2xl font-bold">#{ranking.findIndex((item) => item.idEquipeFantasy === userTeam?.id) + 1}</p>
                </div>
                <div className="p-4 bg-muted rounded">
                  <p className="text-sm">Sua pontuação</p>
                  <p className="text-xl font-bold text-green-400">
                    {tipoRanking === 'geral'
                      ? ranking.find((item) => item.idEquipeFantasy === userTeam?.id)?.pontuacaoTotal ?? 0
                      : ranking.find((item) => item.idEquipeFantasy === userTeam?.id)?.pontuacaoRodada ?? 0}
                    {' '}pts
                  </p>
                </div>
                <div className="p-4 bg-muted rounded">
                  <p className="text-sm">Patrimônio</p>
                  <p className="text-xl font-bold">C$ {userEntry?.patrimonio ?? 0}</p>
                </div>
              </>
            )}
          </div>

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
              <Select value={rodadaSelecionada.toString()} onValueChange={(value) => setRodadaSelecionada(value === 'todas' ? 'todas' : Number(value))}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  {rodadaOptions.map((rodada) => (
                    <SelectItem key={rodada.id} value={rodada.numero.toString()}>
                      Rodada {rodada.numero}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Ranking da Liga
              </CardTitle>
              <CardDescription>Classificação dos participantes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pos</TableHead>
                    <TableHead>Logo</TableHead>
                    <TableHead>Equipe</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="text-right">Pontos</TableHead>
                    <TableHead className="text-right">Patrimônio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ranking.map((item, index) => (
                    <TableRow key={item.id || `${item.idLiga}-${item.idEquipeFantasy}`}>
                      <TableCell>
                        {index + 1 <= 3 ? (
                          <Medal className={`h-5 w-5 ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-400' : 'text-amber-600'}`} />
                        ) : (
                          index + 1
                        )}
                      </TableCell>
                      <TableCell>
                        <Avatar className="h-8 w-8">
                          {item.logoEquipe ? <AvatarImage src={item.logoEquipe} alt={item.nomeEquipe} /> : <AvatarFallback>{item.nomeEquipe?.charAt(0)}</AvatarFallback>}
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-bold">{item.nomeEquipe}</TableCell>
                      <TableCell>{item.usuarioId === user?.id ? `${item.nomeUsuario} (Você)` : item.nomeUsuario}</TableCell>
                      <TableCell className="text-right font-bold text-primary">
                        {tipoRanking === 'geral' ? item.pontuacaoTotal : item.pontuacaoRodada}
                      </TableCell>
                      <TableCell className="text-right">C$ {item.patrimonio}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regras">
          <Card>
            <CardHeader>
              <CardTitle>Regras da Liga</CardTitle>
              <CardDescription>
                Sistema de pontuação e configurações
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">

              {regrasDaLiga.length > 0 ? (
                <div>
                  <h3 className="font-semibold mb-3">
                    Sistema de Pontuação
                  </h3>

                  <div className="grid md:grid-cols-2 gap-3">

                    {regrasDaLiga.map((regra) => {

                      const acaoIcones: Record<string, string> = {
                        GOLS: '⚽',
                        ASSISTENCIAS: '🎯',
                        CARTOES_AMARELOS: '🟨',
                        CARTOES_VERMELHOS: '🟥',
                        FINALIZACOES: '🔫',
                        IMPEDIMENTOS: '⚠️',
                        FALTAS_COMETIDAS: '🙅',
                        FALTAS_RECEBIDAS: '👂',
                        CANETAS: '🍌',
                        CHAPEUS: '🎩',
                        DRIBLES_SIMPLES: '🎪'
                      }

                      const acaoLabels: Record<string, string> = {
                        GOLS: 'Gol',
                        ASSISTENCIAS: 'Assistência',
                        CARTOES_AMARELOS: 'Cartão amarelo',
                        CARTOES_VERMELHOS: 'Cartão vermelho',
                        FINALIZACOES: 'Finalização',
                        IMPEDIMENTOS: 'Impedimento',
                        FALTAS_COMETIDAS: 'Falta cometida',
                        FALTAS_RECEBIDAS: 'Falta recebida',
                        CANETAS: 'Caneta',
                        CHAPEUS: 'Chapéu',
                        DRIBLES_SIMPLES: 'Drible'
                      }

                      const isNegative = regra.valor < 0

                      return (
                        <div
                          key={regra.id}
                          className="p-3 bg-muted rounded flex justify-between items-center"
                        >
                          <span>
                            {acaoIcones[regra.acao] || '•'}{' '}
                            {acaoLabels[regra.acao] || regra.acao}
                          </span>

                          <span
                            className={`font-bold ${isNegative
                              ? 'text-red-400'
                              : 'text-green-400'
                              }`}
                          >
                            {isNegative ? '' : '+'}
                            {regra.valor}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Nenhuma regra configurada para esta liga.
                </p>
              )}

            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scouts">
          <div className="space-y-6">

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
                <Select
                  value={rodadaSelecionada.toString()}
                  onValueChange={(v) =>
                    setRodadaSelecionada(v === 'todas' ? 'todas' : Number(v))
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="todas">
                      Todas
                    </SelectItem>

                    {rodadaOptions.map((rodada) => (
                      <SelectItem
                        key={rodada.id}
                        value={rodada.numero.toString()}
                      >
                        Rodada {rodada.numero}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* ARTILHARIA */}

            <Card>
              <CardHeader>
                <CardTitle>Artilharia</CardTitle>
                <CardDescription>
                  Gols marcados pelos atletas
                </CardDescription>
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
                      .sort((a: any, b: any) => b.gols - a.gols)
                      .map((desempenho: any) => {
                        return (
                          <TableRow key={desempenho.atleta?.id}>
                            <TableCell>{desempenho.atleta?.nome}</TableCell>
                            <TableCell>{desempenho.atleta?.clube?.nome}</TableCell>
                            <TableCell className="text-right font-bold text-primary">
                              {desempenho.gols}
                            </TableCell>
                            <TableCell className="text-right">
                              {desempenho.assistencias}
                            </TableCell>
                            <TableCell className="text-right">
                              {desempenho.finalizacoes}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* ESTATÍSTICAS COMPLETAS */}

            <Card>
              <CardHeader>
                <CardTitle>Estatísticas Completas</CardTitle>
                <CardDescription>
                  Desempenho geral dos atletas
                </CardDescription>
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
                      .sort(
                        (a: any, b: any) =>
                          b.pontosCalculados - a.pontosCalculados
                      )
                      .map((desempenho: any) => {
                        const cartoes =
                          (desempenho.cartoesAmarelos || 0) +
                          (desempenho.cartoesVermelhos || 0)

                        return (
                          <TableRow key={desempenho.atleta?.id}>
                            <TableCell>{desempenho.atleta?.nome}</TableCell>
                            <TableCell className="text-right">
                              {desempenho.gols}
                            </TableCell>
                            <TableCell className="text-right">
                              {desempenho.assistencias}
                            </TableCell>
                            <TableCell className="text-right">
                              {desempenho.driblesSimples}
                            </TableCell>
                            <TableCell className="text-right">
                              {desempenho.caneta}
                            </TableCell>
                            <TableCell className="text-right text-red-400">
                              {cartoes}
                            </TableCell>
                            <TableCell className="text-right font-bold text-primary">
                              {desempenho.pontosCalculados}
                            </TableCell>
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
