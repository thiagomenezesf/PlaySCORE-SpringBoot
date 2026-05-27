'use client'

import { useState, useRef, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, User, DollarSign, TrendingUp, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import api from '@/lib/api'
import type { Atleta } from '@/types'
import {
  mockAtletas,
  mockClubes,
  mockEscalacao,
  mockRodadas,
  mockCampeonatoRodadas,
  mockDesempenhoAtleta,
  mockDesempenhoEquipeFantasy,
  mockEquipesFantasy,
  mockLigas,
  mockEquipeLiga,
  mockCampeonatos,
} from '@/mocks/database'
import { Toaster } from '@/components/ui/toaster'
import { X } from 'lucide-react'
import { layoutsPorTipo, tiposJogo, posicaoLabels, posicaoColors } from '@/lib/jogo-config'
import { calcularPontosAtleta, calcularValorAtualizado, calcularPontuacaoEquipe } from '@/lib/game-utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type JogadorEscalado = {
  id: number
  nome: string
  posicao: Atleta['posicao']
  preco: number
  clube: string
  isCapitao: boolean
  pontuacao?: number
  foto?: string
}

/* ================= MOCKS ================= */

// 🔥 MOCK pontuação jogador (fallback quando não há desempenho)
const getPontuacaoJogador = (_id: number) => {
  return Number((Math.random() * 10).toFixed(2))
}

export default function EscalacaoPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  const { ligaId } = useParams()
  const ligaIdNumber = Number(ligaId)

  // Buscar dados dinamicamente (API ou mocks)
  const [apiAtletas, setApiAtletas] = useState<any[] | null>(null)
  const [apiClubes, setApiClubes] = useState<any[] | null>(null)
  const [apiEscalacao, setApiEscalacao] = useState<any[] | null>(null)
  const [apiRodadas, setApiRodadas] = useState<any[] | null>(null)
  const [apiCampeonatos, setApiCampeonatos] = useState<any[] | null>(null)
  const [apiCampeonatoRodadas, setApiCampeonatoRodadas] = useState<any[] | null>(null)
  const [apiDesempenhoAtleta, setApiDesempenhoAtleta] = useState<any[] | null>(null)
  const [apiDesempenhoEquipeFantasy, setApiDesempenhoEquipeFantasy] = useState<any[] | null>(null)
  const [apiEquipesFantasy, setApiEquipesFantasy] = useState<any[] | null>(null)
  const [apiLigas, setApiLigas] = useState<any[] | null>(null)
  const [apiEquipeLiga, setApiEquipeLiga] = useState<any[] | null>(null)

  useEffect(() => {
    const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'
    if (useMocks) return

    api.listAtletas().then((d) => setApiAtletas(d)).catch(() => null)
    api.listClubes().then((d) => setApiClubes(d)).catch(() => null)
    api.listEscalacoes().then((d) => setApiEscalacao(d)).catch(() => null)
    api.listRodadas().then((d) => setApiRodadas(d)).catch(() => null)
    api.listCampeonatos().then((d) => setApiCampeonatos(d)).catch(() => null)
    api.listCampeonatoRodadas().then((d) => setApiCampeonatoRodadas(d)).catch(() => null)
    api.listDesempenhoAtleta().then((d) => setApiDesempenhoAtleta(d)).catch(() => null)
    api.listDesempenhoEquipeFantasy().then((d) => setApiDesempenhoEquipeFantasy(d)).catch(() => null)
    api.listEquipesFantasy().then((d) => setApiEquipesFantasy(d)).catch(() => null)
    api.listLigas().then((d) => setApiLigas(d)).catch(() => null)
    api.listEquipeLiga().then((d) => setApiEquipeLiga(d)).catch(() => null)
  }, [])

  const atletasSource = apiAtletas ?? []
  const clubesSource = apiClubes ?? []
  const escalacoesSource = apiEscalacao ?? []
  const rodadasSource = apiRodadas ?? []
  const campeonatoRodadasSource = apiCampeonatoRodadas ?? []
  const desempenhoAtletaSource = apiDesempenhoAtleta ?? []
  const desempenhoEquipeFantasySource = apiDesempenhoEquipeFantasy ?? []
  const equipesFantasySource = apiEquipesFantasy ?? []
  const ligasSource = apiLigas ?? []
  const equipeLigaSource = apiEquipeLiga ?? []

  const liga = ligasSource.find(l => l.id === ligaIdNumber)
  const campeonatosSource = apiCampeonatos ?? []
  const campeonato = liga ? (campeonatosSource.find(c => c.id === liga.idCampeonato) ?? null) : null
  const equipeFantasy = equipesFantasySource.find(equipe => equipe.idUsuario === user?.id)
  const equipeLiga = liga && equipeFantasy ? equipeLigaSource.find(el => el.idLiga === liga.id && el.idEquipeFantasy === equipeFantasy.id) : null
  
  // Verificar a rodada atual do campeonato via relacionamento campeonatoRodada
  const rodasLiga = liga ? rodadasSource.filter(r => r.idCampeonato === liga.idCampeonato) : []
  const campeonatoRodada = campeonato ? campeonatoRodadasSource.find(cr => cr.idCampeonato === campeonato.id) : null
  const rodadaAtual = campeonatoRodada
    ? rodadasSource.find(r => r.id === campeonatoRodada.idRodada) ?? null
    : rodasLiga.length > 0 ? rodasLiga[rodasLiga.length - 1] : null
  const mercadoFechado = rodadaAtual?.status !== 'ABERTO'
  
  // Carregar escalações existentes para esta rodada e equipe
  const escalacoesExistentes = equipeLiga && rodadaAtual
    ? escalacoesSource.filter(e => e.idRodada === rodadaAtual.id && e.idEquipeLiga === equipeLiga.id)
    : []

  const equipePontuacaoTotal = equipeFantasy && liga
    ? calcularPontuacaoEquipe(equipeFantasy.id, liga.id, desempenhoEquipeFantasySource, rodadaAtual?.id)
    : null

  // Preparar mercado com atletas do database
  const mercado = atletasSource
    .map(atleta => {
      const clube = clubesSource.find(c => c.id === atleta.idClube)
      const desempenho = rodadaAtual
        ? desempenhoAtletaSource.find(d => d.idAtleta === atleta.id && d.idRodada === rodadaAtual.id)
        : undefined
      const pontos = calcularPontosAtleta(atleta.id, rodadaAtual?.id ?? null, desempenhoAtletaSource)
      return {
        ...atleta,
        clube: {
          id: clube?.id || 0,
          nome: clube?.nome || 'Clube Desconhecido',
          logo: clube?.logo || 'https://i.pravatar.cc/100?img=99',
          idCampeonato: clube?.idCampeonato || 0
        },
        pontuacao: pontos || getPontuacaoJogador(atleta.id),
        valorAtualizado: calcularValorAtualizado(atleta.precoInicial, desempenho)
      } as Atleta & { clube: any; pontuacao: number; valorAtualizado: number }
    })
    .filter(a => {
      // Mostrar apenas atletas cujo clube pertence ao mesmo campeonato da liga atual
      if (!liga || !liga.idCampeonato) return false
      return a.clube?.idCampeonato === liga.idCampeonato
    })
  
  // Loading states
  if (!user) {
    return <div className="p-6">Carregando usuário...</div>
  }

  if (!liga) {
    return <div className="p-6">Liga não encontrada</div>
  }

  if (!campeonato) {
    return <div className="p-6">Campeonato não encontrado</div>
  }


  // Determinar configuração do jogo baseado no campeonato
  const tipoJogo = (campeonato?.tipoJogo as 'CAMPO' | 'FUTSAL' | 'FUT7') || 'CAMPO'
  const configJogo = tiposJogo[tipoJogo]

  // Carregar atletas escalados na rodada atual
  const atletasEscaladosIds = escalacoesExistentes.map(e => e.idAtleta)
  const atletasEscaladosCarregados: JogadorEscalado[] = atletasEscaladosIds.map(atletaId => {
    const atleta = atletasSource.find(a => a.id === atletaId)
    const clube = atleta ? clubesSource.find(c => c.id === atleta.idClube) : null
    const desempenhoAtletaCarregado = atleta
      ? desempenhoAtletaSource.find(d => d.idAtleta === atleta.id && d.idRodada === rodadaAtual?.id)
      : undefined
    return {
      id: atletaId,
      nome: atleta?.nome || '',
      posicao: (atleta?.posicao || 'GOL') as Atleta['posicao'],
      preco: calcularValorAtualizado(atleta?.precoInicial || 0, desempenhoAtletaCarregado),
      clube: clube?.nome || '',
      isCapitao: escalacoesExistentes.find(e => e.idAtleta === atletaId)?.isCapitao || false,
      pontuacao: calcularPontosAtleta(atletaId, rodadaAtual?.id ?? null, desempenhoAtletaSource) || getPontuacaoJogador(atletaId),
      foto: atleta?.foto
    }
  })

  const mockMeuTime = {
    nome: equipeFantasy?.nome || 'Meu Time FC',
    patrimonio: equipeLiga?.patrimonio || 100,
    pontuacaoTotal: equipePontuacaoTotal,
    escalados: atletasEscaladosCarregados,
  }

  const [searchTerm, setSearchTerm] = useState('')
  const [formacao, setFormacao] = useState(configJogo.formacoes[0])

  const layoutAtual = layoutsPorTipo[tipoJogo][formacao.nome]

  if (!layoutAtual) {
    return <div>Layout não encontrado</div>
  }

  const [time, setTime] = useState(mockMeuTime)

  // Atualizar time quando os dados mudam
  useEffect(() => {
    setTime(mockMeuTime)
  }, [mockMeuTime.patrimonio, mockMeuTime.nome])

  const [posicaoFiltro, setPosicaoFiltro] = useState<Atleta['posicao'] | 'ALL'>('ALL')
  const [slotSelecionado, setSlotSelecionado] = useState<Atleta['posicao'] | null>(null)

  const gastoTotal = time.escalados.reduce((acc, a) => acc + a.preco, 0)
  const patrimonioRestante = time.patrimonio - gastoTotal
  const rodadaTemPontuacao = time.pontuacaoTotal !== null

  const totalJogadores = Object.values(formacao.estrutura)
  .reduce((acc, val) => acc + (val || 0), 0)

  const adicionarJogador = (atleta: Atleta) => {
  const pos = atleta.posicao
  const limite = formacao.estrutura[pos]

  const jogadoresPos = time.escalados.filter(a => a.posicao === pos)

  if (limite != null && jogadoresPos.length >= limite) return

  const jaExiste = time.escalados.some(a => a.id === atleta.id)

  if (jaExiste) return

  const novoJogador: JogadorEscalado = {
    id: atleta.id,
    nome: atleta.nome,
    posicao: pos,
    preco: (atleta as Atleta & { valorAtualizado?: number }).valorAtualizado ?? atleta.precoInicial,
    clube: atleta.clube?.nome || '',
    isCapitao: false,
    pontuacao: atleta.pontuacao,
    foto: atleta.foto
  }

  setTime({
    ...time,
    escalados: [...time.escalados, novoJogador]
  })
}

  const removerJogador = (id: number) => {
    setTime({ ...time, escalados: time.escalados.filter(a => a.id !== id) })
  }

  const definirCapitao = (id: number) => {
    setTime({
      ...time,
      escalados: time.escalados.map(a => ({
        ...a,
        isCapitao: a.id === id
      }))
    })
  }

  const limparTime = () => {
    setTime({ ...time, escalados: [] })
  }

  const handleSalvar = async () => {
    const formacaoCompleta = (Object.entries(formacao.estrutura) as [Atleta['posicao'], number][]) 
      .every(([pos, limite]) => time.escalados.filter(a => a.posicao === pos).length === limite)

    if (!formacaoCompleta) {
      toast({
        title: 'Escalação incompleta',
        description: 'Preencha todas as posições do campo antes de salvar.',
        variant: 'destructive'
      })
      return
    }

    if (!rodadaAtual || !equipeLiga || !equipeFantasy) {
      toast({
        title: 'Erro ao salvar',
        description: 'Dados da rodada ou equipe não encontrados.',
        variant: 'destructive'
      })
      return
    }

    try {
      // Envia uma requisição para cada jogador escalado
      await Promise.all(time.escalados.map(j => api.createEscalacao({
        idAtleta: j.id,
        idRodada: rodadaAtual.id,
        idEquipeLiga: equipeLiga.id,
        idEquipeFantasy: equipeFantasy.id,
        isCapitao: !!j.isCapitao
      })))

      toast({
        title: 'Escalação salva',
        description: 'Seu time foi salvo com sucesso!'
      })
    } catch (e: any) {
      console.error('Erro ao salvar escalação', e)
      toast({
        title: 'Falha ao salvar',
        description: e?.message || 'Erro desconhecido ao comunicar com o servidor',
        variant: 'destructive'
      })
    }
  }

  const getJogadores = (pos: Atleta['posicao']) =>
    time.escalados.filter(a => a.posicao === pos)

  const mercadoFiltrado = mercado
    .filter(a => a.nome.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(a => posicaoFiltro === 'ALL' || a.posicao === posicaoFiltro)

  const posicoesDisponiveis = Array.from(
    new Set(mercado.map(a => a.posicao))
  ) as Atleta['posicao'][]

  const handleSelecionarSlot = (pos: Atleta['posicao']) => {
    setSlotSelecionado(pos)
    setPosicaoFiltro(pos)
  }

  return (
    <div className="space-y-6">
      <Toaster />

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/ligas/${ligaId}`}>
              <ArrowLeft />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Escalação</h1>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={limparTime}>
            Limpar Escalação
          </Button>
          <Button onClick={handleSalvar}>
            Salvar Escalação
          </Button>
        </div>
      </div>

      {/* DASHBOARD */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 flex gap-3 items-center">
          <div className="p-2 rounded bg-green-500/20 border border-green-500/30">
            <DollarSign className="text-green-400" />
          </div>
          <div><p className="text-sm">Patrimônio Restante</p><p className="font-bold">C$ {patrimonioRestante.toFixed(2)}</p></div>
        </CardContent></Card>

        <Card><CardContent className="p-4 flex gap-3 items-center">
          <div className="p-2 rounded bg-yellow-500/20 border border-yellow-500/30">
            <TrendingUp className="text-yellow-400" />
          </div>
          <div><p className="text-sm">Gasto</p><p className="font-bold">C$ {gastoTotal}</p></div>
        </CardContent></Card>

        <Card><CardContent className="p-4 flex gap-3 items-center">
          <div className="p-2 rounded bg-emerald-500/20 border border-emerald-500/30">
            <User className="text-emerald-400" />
          </div>
          <div><p className="text-sm">Escalados</p><p className="font-bold">{time.escalados.length}/{totalJogadores}</p></div>
        </CardContent></Card>

        <Card><CardContent className="p-4 flex gap-3 items-center">
          <div className="p-2 rounded bg-amber-500/20 border border-amber-500/30">
            <Star className="text-amber-400" />
          </div>
          <div><p className="font-bold">
            {rodadaTemPontuacao
              ? `${time.pontuacaoTotal} pts`
              : '---'}
          </p></div>
        </CardContent></Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* CAMPO */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Meu Time Fantasy</CardTitle>
              <CardTitle className="text-green-700 text-[1.5rem] font-bold">
                {rodadaTemPontuacao
                  ? `${time.pontuacaoTotal} pts`
                  : '---'}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

              <Select
                value={formacao.nome}
                onValueChange={(v) => {
                  const novaFormacao = configJogo.formacoes.find(f => f.nome === v)
                  if (!novaFormacao) return

                  const excedeu = Object.entries(novaFormacao.estrutura).some(
                    ([pos, limite]) => {
                      const qtd = time.escalados.filter(j => j.posicao === pos).length
                      return qtd > limite
                    }
                  )

                  if (excedeu) {
                    toast({
                      title: "Formação inválida",
                      description: "Venda jogadores antes de mudar para essa formação.",
                      variant: "destructive"
                    })
                    return
                  }

                  setFormacao(novaFormacao)
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {configJogo.formacoes.map(f => (
                    <SelectItem key={f.nome} value={f.nome}>{f.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* CAMPO EM PÉ */}
              <div className="relative w-full aspect-[4/4] bg-green-700 rounded-xl overflow-hidden">

                {/* HUD SUPERIOR */}
                <div className="absolute top-2 left-4 text-white text-sm font-bold">
                  {formacao.nome}
                </div>

                <div className="absolute inset-4 border border-white/30 rounded-lg" />
                <div className="absolute top-1/2 left-4 right-4 h-[2px] bg-white/30" />
                <div className="absolute left-1/2 top-1/2 w-20 h-20 border border-white/30 rounded-full -translate-x-1/2 -translate-y-1/2" />

      <div className="absolute inset-0">

  {Object.entries(layoutAtual).map(([posicao, coordenadas]) => {

    return coordenadas.map((coord, index) => {

      const atleta =
        getJogadores(posicao as Atleta['posicao'])[index]

      return (
        <div
          key={`${posicao}-${index}`}
          className="absolute"
          style={{
            left: `${coord.x}%`,
            top: `${coord.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {atleta ? (
            <PlayerSlot
              atleta={atleta}
              isCapitao={atleta.isCapitao}
              onRemove={removerJogador}
              onCapitao={definirCapitao}
              mostrarPontuacao={mercadoFechado}
            />
          ) : (
            <EmptySlot
              onClick={() =>
                handleSelecionarSlot(posicao as Atleta['posicao'])
              }
              selected={slotSelecionado === posicao}
            />
          )}
        </div>
      )
    })
  })}
</div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* MERCADO */}
        <Card>
          <CardHeader>
            <CardTitle>Mercado de Atletas</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {mercadoFechado && (
              <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-4 text-yellow-900">
                <p className="font-semibold">Mercado Fechado</p>
                <p className="text-sm text-muted-foreground mt-1">
                  A rodada atual está fechada. Você ainda pode acompanhar as pontuações dos jogadores e da equipe.
                </p>
              </div>
            )}

            {!mercadoFechado ? (
              <>
              {/*MERCADO ABERTO*/}
              

            <Input
              placeholder="Buscar jogador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Select
            value={posicaoFiltro}
            onValueChange={(v: any) => setPosicaoFiltro(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar posição" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todas</SelectItem>
                {posicoesDisponiveis.map(pos => (
                  <SelectItem
                    key={pos}
                    value={pos}
                  >
                    {posicaoLabels[pos] || pos}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {mercadoFiltrado.map(a => {
              const jaEscalado = time.escalados.some(j => j.id === a.id)

              const jogadoresPos = time.escalados.filter(j => j.posicao === a.posicao)
              const limitePosicao = formacao.estrutura[a.posicao]
              const limiteAtingido = limitePosicao != null && jogadoresPos.length >= limitePosicao
              const semDinheiro = a.valorAtualizado > patrimonioRestante

              return (
                <div key={a.id} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        {a.foto ? (
                          <AvatarImage src={a.foto} alt={a.nome} />
                        ) : (
                          <AvatarFallback>{a.nome.charAt(0)}</AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{a.nome}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {a.clube?.logo ? (
                            <Avatar className="h-4 w-4">
                              <AvatarImage src={a.clube.logo} alt={a.clube?.nome} />
                            </Avatar>
                          ) : (
                            <Avatar className="h-4 w-4">
                              <AvatarFallback>{a.clube?.nome?.charAt(0)}</AvatarFallback>
                            </Avatar>
                          )}
                          <span>{a.clube?.nome}</span>
                        </div>
                      </div>
                    </div>

                    <Badge className={cn('border text-xs', posicaoColors[a.posicao])}>
                      {posicaoLabels[a.posicao] || a.posicao}
                    </Badge>
                  </div>

                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-muted-foreground">Preço</span>
                    <div className="text-right">
                      <div className="font-bold text-primary">C$ {a.valorAtualizado.toFixed(2)}</div>
                      <div className={cn('text-xs font-medium', a.valorAtualizado - a.precoInicial >= 0 ? 'text-emerald-500' : 'text-red-500')}>
                        {a.valorAtualizado - a.precoInicial >= 0 ? '+' : ''}{(a.valorAtualizado - a.precoInicial).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    disabled={!jaEscalado && (limiteAtingido || semDinheiro)}
                    className={cn(
                      "w-full mt-2",
                      jaEscalado && "bg-red-500 hover:bg-red-600 text-white",
                      !jaEscalado && (limiteAtingido || semDinheiro) && "bg-gray-400 cursor-not-allowed"
                    )}
                    onClick={() => {
                      if (jaEscalado) {
                        removerJogador(a.id)
                      } else {
                        if (semDinheiro) {
                          toast({
                            title: "Saldo insuficiente",
                            description: "Você não tem patrimônio suficiente para esse jogador.",
                            variant: "destructive"
                          })
                          return
                        }

                        if (limiteAtingido) {
                          toast({
                            title: "Limite atingido",
                            description: `Você já tem o máximo de jogadores dessa posição.`,
                            variant: "destructive"
                          })
                          return
                        }

                        adicionarJogador(a)
                      }
                    }}
                  >
                    {jaEscalado
                      ? "Vender"
                      : limiteAtingido
                        ? "Limite atingido"
                        : semDinheiro
                          ? "Sem saldo"
                          : "Escalar"}
                  </Button>
                </div>
              )
            })} 
            </>
            ): (
    <>
      {/* RANKING DA RODADA */}

      <Input
              placeholder="Buscar jogador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Select onValueChange={(v: any) => setPosicaoFiltro(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar posição" />
              </SelectTrigger>
              <SelectContent>
                {posicoesDisponiveis.map(pos => (
    <SelectItem
      key={pos}
      value={pos}
    >
      {posicaoLabels[pos] || pos}
    </SelectItem>
  ))}
              </SelectContent>
            </Select>

      {mercadoFiltrado
        .sort((a, b) => (b.pontuacao || 0) - (a.pontuacao || 0))
        .map((a) => (
          <div
            key={a.id}
            className="p-3 rounded-lg bg-muted/50"
          >
            <div className="flex justify-between items-center">

              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  {a.foto ? (
                    <AvatarImage src={a.foto} alt={a.nome} />
                  ) : (
                    <AvatarFallback>{a.nome.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="font-medium text-sm">
                    {a.nome}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {a.clube?.logo ? (
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={a.clube.logo} alt={a.clube?.nome} />
                      </Avatar>
                    ) : (
                      <Avatar className="h-4 w-4">
                        <AvatarFallback>{a.clube?.nome?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <span>{a.clube?.nome}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-green-400 font-bold">
                  {a.pontuacao?.toFixed(2)} pts
                </p>

                <Badge className={cn(
                  'border text-xs',
                  posicaoColors[a.posicao]
                )}>
                  {posicaoLabels[a.posicao] || a.posicao}
                </Badge>
              </div>

            </div>
          </div>
      ))}

    </>
  )}

          </CardContent>
        </Card>

      </div>
    </div>
  )
}

/* SLOT */
function EmptySlot({ onClick, selected }: any) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "w-15 h-15 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer",
        selected ? "border-yellow-400 bg-yellow-400/20" : "border-white/50 hover:bg-white/10"
      )}
    >
      +
    </div>
  )
}

/* PLAYER */

function PlayerSlot({ atleta, isCapitao, onRemove, onCapitao, mostrarPontuacao }: any) {
  const [openMenu, setOpenMenu] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // 👉 fecha ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpenMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="flex flex-col items-center relative">

      <div
        onClick={() => setOpenMenu(!openMenu)}
        className={cn(
          'relative w-15 h-15 rounded-full flex items-center justify-center cursor-pointer border-2 bg-white text-black',
          isCapitao ? 'border-yellow-400' : 'border-green-500'
        )}
      >
        <Avatar className="h-full w-full">
          {atleta.foto ? (
            <AvatarImage src={atleta.foto} alt={atleta.nome} />
          ) : (
            <AvatarFallback>{atleta.nome.charAt(0)}</AvatarFallback>
          )}
        </Avatar>

        {/* CAPITÃO FIXO */}
        {isCapitao && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-400 text-black text-xs flex items-center justify-center">
            C
          </div>
        )}

        {/* MENU (X + Capitão) */}
        {openMenu && (
          <>
            {/* REMOVER */}
            <div
              onClick={(e) => {
                e.stopPropagation()
                onRemove(atleta.id)
              }}
              className="absolute -top-2 -left-2 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center"
            >
              <X size={12} className="text-white" />
            </div>

            {/* CAPITÃO */}
            <div
              onClick={(e) => {
                e.stopPropagation()
                onCapitao(atleta.id)
                setOpenMenu(false)
              }}
              className="absolute -bottom-2 -right-2 w-5 h-5 bg-yellow-400 hover:bg-yellow-500 rounded-full flex items-center justify-center"
            >
              <Star size={12} className="text-black" />
            </div>
          </>
        )}
      </div>

      <span className="text-xs text-white mt-1 bg-black/60 px-1 rounded">
        {atleta.nome.split(' ')[0]}
      </span>
      {mostrarPontuacao && (
        <span className="text-[11px] font-bold text-green-300">
          {atleta.pontuacao?.toFixed(2)} pts
        </span>
      )}
    </div>
  )
}