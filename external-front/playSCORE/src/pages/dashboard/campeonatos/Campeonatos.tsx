import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { ChampionshipCard } from '@/components/playscore/championship-card'
import { useAuth } from '@/hooks/use-auth'
import { mockCampeonatos } from '@/mocks/database'
import type { Campeonato } from '@/types'

export default function CampeonatosPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')

  const filterCampeonatos = (campeonatos: Campeonato[]) => {
    return campeonatos.filter(c =>
      c.nome.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const meusCampeonatos = mockCampeonatos.filter(c => user?.id != null && c.idUsuario === user.id) as Campeonato[]
  const todosCampeonatos = mockCampeonatos as Campeonato[]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Campeonatos</h1>
          <p className="text-muted-foreground">
            Gerencie seus campeonatos ou encontre novos para criar ligas.
          </p>
        </div>
        <Button asChild>
          <Link to="/campeonatos/criar">
            <Plus className="h-4 w-4 mr-2" />
            Criar Campeonato
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar campeonatos..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="meus" className="space-y-6">
        <TabsList>
          <TabsTrigger value="meus" className="gap-2">
            <Shield className="h-4 w-4" />
            Meus Campeonatos
          </TabsTrigger>
          <TabsTrigger value="todos" className="gap-2">
            <Shield className="h-4 w-4" />
            Todos os Campeonatos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="meus" className="space-y-6">
          {filterCampeonatos(meusCampeonatos).length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filterCampeonatos(meusCampeonatos).map((campeonato) => (
                <ChampionshipCard
                  key={campeonato.id}
                  campeonato={campeonato}
                  isOwner={campeonato.idUsuario === user?.id}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum campeonato criado</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Voce ainda não criou nenhum campeonato. Crie um agora!
                </p>
                <Button asChild>
                  <Link to="/campeonatos/criar">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Campeonato
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="todos" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterCampeonatos(todosCampeonatos).map((campeonato) => (
              <ChampionshipCard
                key={campeonato.id}
                campeonato={campeonato}
                isOwner={campeonato.idUsuario === user?.id}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}