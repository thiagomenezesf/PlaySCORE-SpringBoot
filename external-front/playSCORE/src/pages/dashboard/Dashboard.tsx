'use client'

import { Link } from 'react-router-dom'
import { Trophy, TrendingUp, Plus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { StatsCard } from '@/components/playscore/stats-card'
import { LeagueCard } from '@/components/playscore/league-card'
import { RoundSummaryCard } from '@/components/playscore/round-summary-card'
import { mockCampeonatos, mockEquipeLiga, mockLigas, mockDesempenhoEquipeFantasy, mockUsuarios } from '@/mocks/database'
import { useAuth } from '@/hooks/use-auth'

const ligasComExtras = mockLigas.map((liga) => ({
  ...liga,
  participantes: mockEquipeLiga.filter((entry) => entry.idLiga === liga.id).length,
  campeonatoNome: mockCampeonatos.find((camp) => camp.id === liga.idCampeonato)?.nome ?? '',
}))

const minhasLigas = ligasComExtras.length
const pontuacaoTotal = mockEquipeLiga.reduce((sum, entry) => sum + entry.pontuacaoTotal, 0)
const equipeDestaque = [...mockEquipeLiga].sort((a, b) => b.pontuacaoTotal - a.pontuacaoTotal)[0]
const resumoRodada = {
  nomeLiga: ligasComExtras.find((liga) => liga.id === equipeDestaque?.idLiga)?.nome ?? 'Liga em destaque',
  logo: undefined,
  pontuacaoRodada:
    equipeDestaque
      ? mockDesempenhoEquipeFantasy.find(
          (entry) => entry.idLiga === equipeDestaque.idLiga && entry.idEquipeFantasy === equipeDestaque.idEquipeFantasy,
        )?.pontuacaoRodada ?? equipeDestaque.pontuacaoTotal
      : 0,
  pontuacaoTotal: equipeDestaque?.pontuacaoTotal ?? 0,
  colocacao: 1,
}

// export ligas and resumo for other components if needed
export { ligasComExtras as dashboardLigas, resumoRodada as dashboardResumo }

const mockNoticias = [
  {
    id: 1,
    titulo: 'Mercado abre na próxima rodada',
    descricao: 'Prepare-se para escalar seu time. O mercado abre amanha as 19h.',
    data: '2 horas atras',
  },
  {
    id: 2,
    titulo: 'Artilheiro da rodada: Carlos Silva',
    descricao: 'Com 3 gols, Carlos Silva foi o destaque da rodada 4.',
    data: '1 dia atras',
  },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const dadosUsuario = mockUsuarios.find(u => u.id === user.id);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">
            Bem-vindo, <span className="text-primary">{dadosUsuario?.nome}!</span>
          </h1>
          <p className="text-muted-foreground">
            Acompanhe suas ligas e escale seu time para a próxima rodada.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/ligas">
              Ver Minhas Ligas
            </Link>
          </Button>
          <Button asChild>
            <Link to="/ligas/criar">
              <Plus className="h-4 w-4 mr-2" />
              Nova Liga
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Minhas Ligas"
          value={minhasLigas}
          description="Ligas que participo"
          icon={Trophy}
        />
        <StatsCard
          title="Pontuação Total"
          value={pontuacaoTotal.toFixed(1)}
          description="Somatório de todas as ligas"
          icon={TrendingUp}
          trend={{ value: 12, isPositive: true }}
        />
        <RoundSummaryCard
          title="Resumo da Rodada"
          leagueName={resumoRodada.nomeLiga}
          logo={resumoRodada.logo}
          roundScore={resumoRodada.pontuacaoRodada}
          totalScore={resumoRodada.pontuacaoTotal}
          position={resumoRodada.colocacao}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Minhas Ligas */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Minhas Ligas</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/ligas">
                Ver todas
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {ligasComExtras.map((liga) => (
              <LeagueCard
                key={liga.id}
                liga={liga}
                isOwner={liga.idUsuarioCriador === 1}
              />
            ))}
          </div>
        </div>

        {/* Noticias/Atualizacoes */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Últimas Notícias</h2>
          <Card>
            <CardContent className="p-0">
              {mockNoticias.map((noticia, index) => (
                <div
                  key={noticia.id}
                  className={`p-4 ${index !== mockNoticias.length - 1 ? 'border-b border-border' : ''}`}
                >
                  <h4 className="font-medium text-sm">{noticia.titulo}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {noticia.descricao}
                  </p>
                  <span className="text-xs text-muted-foreground mt-2 block">
                    {noticia.data}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}