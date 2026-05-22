'use client'

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, Trophy, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { LeagueCard } from '@/components/playscore/league-card'
import { useAuth } from '@/hooks/use-auth'
import { mockLigas, mockCampeonatos, mockEquipesFantasy, mockEquipeLiga } from '@/mocks/database'

export default function LigasPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')

  const ligasComExtras = useMemo(
    () =>
      mockLigas.map((liga) => ({
        ...liga,
        descricao: 'Liga competitiva para testar seu time.',
        participantes: mockEquipeLiga.filter((equipe) => equipe.idLiga === liga.id).length,
        campeonatoNome: mockCampeonatos.find((camp) => camp.id === liga.idCampeonato)?.nome ?? '',
      })),

    []
  )

  const userFantasyTeamIds = useMemo(
    () =>
      user
        ? mockEquipesFantasy.filter((equipe) => equipe.idUsuario === user.id).map((equipe) => equipe.id)
        : [],
    [user]
  )

  const mockTodasLigas = ligasComExtras
  const mockLigasCriadas = ligasComExtras.filter((liga) => user?.id != null && liga.idUsuarioCriador === user.id)
  const mockLigasParticipo = ligasComExtras.filter((liga) =>
    userFantasyTeamIds.some((teamId) =>
      mockEquipeLiga.some((entry) => entry.idLiga === liga.id && entry.idEquipeFantasy === teamId)
    )
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Ligas</h1>
          <p className="text-muted-foreground">
            Gerencie suas ligas e encontre novas competicoes.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/ligas/criar">
              <Plus className="h-4 w-4 mr-2" />
              Criar Liga
            </Link>
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar ligas..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="todas" className="space-y-6">
        <TabsList>
          <TabsTrigger value="todas" className="gap-2">
            <Search className="h-4 w-4" />
            Todas as Ligas
          </TabsTrigger>
          <TabsTrigger value="criadas" className="gap-2">
            <Trophy className="h-4 w-4" />
            Ligas Criadas
          </TabsTrigger>
          <TabsTrigger value="participo" className="gap-2">
            <Users className="h-4 w-4" />
            Ligas que Participo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todas" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockTodasLigas
              .filter((liga) => liga.nome.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((liga) => (
                <LeagueCard
                  key={liga.id}
                  liga={liga}
                  isOwner={liga.idUsuarioCriador === user?.id}
                  showJoinButton={
                    user != null &&
                    liga.idUsuarioCriador !== user.id &&
                    !mockEquipeLiga.some(
                      (entry) =>
                        entry.idLiga === liga.id &&
                        userFantasyTeamIds.includes(entry.idEquipeFantasy)
                    )
                  }
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="criadas" className="space-y-6">
          {mockLigasCriadas.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockLigasCriadas
                .filter(liga => liga.nome.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((liga) => (
                  <LeagueCard
                    key={liga.id}
                    liga={liga}
                    isOwner={true}
                  />
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma liga criada</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Voce ainda nao criou nenhuma liga. Crie uma agora!
                </p>
                <Button asChild>
                  <Link to="/ligas/criar">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Liga
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="participo" className="space-y-6">
          {mockLigasParticipo.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockLigasParticipo
                .filter(liga => liga.nome.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((liga) => (
                  <LeagueCard
                    key={liga.id}
                    liga={liga}
                    isOwner={false}
                  />
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Voce nao participa de nenhuma liga</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Entre em uma liga usando o codigo de acesso.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}