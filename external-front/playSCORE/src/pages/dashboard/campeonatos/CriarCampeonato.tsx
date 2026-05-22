'use client'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Shield, Upload, Plus, X, Users, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { tipoJogoOptions, posicoesPorTipoJogo, posicaoLabels } from '@/lib/jogo-config'

interface Clube {
  id: string
  nome: string
  logo?: string
}

interface Atleta {
  id: string
  nome: string
  posicao: string
  foto?: string
  precoInicial: number
  clubeId: string
}

export default function CriarCampeonatoPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('info')
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    tipoJogo: 'CAMPO',
  })
  const [clubes, setClubes] = useState<Clube[]>([])
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [novoClube, setNovoClube] = useState({ nome: '', logo: '' })
  const [novoAtleta, setNovoAtleta] = useState({
    nome: '',
    posicao: '',
    foto: '',
    precoInicial: 0,
    clubeId: ''
  })

  const posicaoOptions = posicoesPorTipoJogo[formData.tipoJogo as keyof typeof posicoesPorTipoJogo]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // TODO: Integrar com Spring Boot via Axios
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Redirecionar para a pagina de gerenciamento do campeonato
    navigate('/campeonatos')
  }

  const handleAddClube = () => {
    if (novoClube.nome.trim()) {
      const clube: Clube = {
        id: Date.now().toString(),
        nome: novoClube.nome,
        logo: novoClube.logo || undefined
      }
      setClubes([...clubes, clube])
      setNovoClube({ nome: '', logo: '' })
    }
  }

  const handleRemoveClube = (id: string) => {
    setClubes(clubes.filter(c => c.id !== id))
    // Remover atletas do clube removido
    setAtletas(atletas.filter(a => a.clubeId !== id))
  }

  const handleAddAtleta = () => {
    if (novoAtleta.nome.trim() && novoAtleta.posicao && novoAtleta.clubeId) {
      const atleta: Atleta = {
        id: Date.now().toString(),
        nome: novoAtleta.nome,
        posicao: novoAtleta.posicao,
        foto: novoAtleta.foto || undefined,
        precoInicial: novoAtleta.precoInicial,
        clubeId: novoAtleta.clubeId
      }
      setAtletas([...atletas, atleta])
      setNovoAtleta({
        nome: '',
        posicao: '',
        foto: '',
        precoInicial: 0,
        clubeId: ''
      })
    }
  }

  const handleRemoveAtleta = (id: string) => {
    setAtletas(atletas.filter(a => a.id !== id))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/campeonatos')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-display font-bold">Criar Novo Campeonato</h1>
          <p className="text-muted-foreground">
            Configure seu campeonato e adicione times e atletas.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="clubes">Clubes</TabsTrigger>
          <TabsTrigger value="atletas">Atletas</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Informacoes do Campeonato
              </CardTitle>
              <CardDescription>
                Preencha os dados basicos do campeonato.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="nome">Nome do Campeonato *</FieldLabel>
                  <Input
                    id="nome"
                    placeholder="Ex: Campeonato da Varzea 2024"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="descricao">Descricao</FieldLabel>
                  <Textarea
                    id="descricao"
                    placeholder="Descreva seu campeonato..."
                    rows={3}
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="tipoJogo">Tipo de Jogo</FieldLabel>
                  <Select
                    value={formData.tipoJogo}
                    onValueChange={(value) => setFormData({ ...formData, tipoJogo: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tipoJogoOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>Logo do Campeonato (opcional)</FieldLabel>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Clique para fazer upload ou arraste uma imagem
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG ate 2MB
                    </p>
                  </div>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => setActiveTab('clubes')}>
              Próximo: Adicionar Clubes
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="clubes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Clubes do Campeonato
              </CardTitle>
              <CardDescription>
                Adicione os times que participarao do campeonato.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Adicionar Clube */}
              <div className="space-y-4">
                <h4 className="font-medium">Adicionar Novo Clube</h4>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="clubeNome">Nome do Clube *</FieldLabel>
                    <Input
                      id="clubeNome"
                      placeholder="Ex: Corinthians"
                      value={novoClube.nome}
                      onChange={(e) => setNovoClube({ ...novoClube, nome: e.target.value })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Logo do Clube (opcional)</FieldLabel>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground">
                        Clique para fazer upload
                      </p>
                    </div>
                  </Field>
                  <Button onClick={handleAddClube} disabled={!novoClube.nome.trim()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Clube
                  </Button>
                </FieldGroup>
              </div>

              <Separator />

              {/* Lista de Clubes */}
              <div className="space-y-4">
                <h4 className="font-medium">Clubes Adicionados ({clubes.length})</h4>
                {clubes.length > 0 ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    {clubes.map((clube) => (
                      <div key={clube.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                            {clube.logo ? (
                              <img src={clube.logo} alt={clube.nome} className="w-6 h-6 object-contain" />
                            ) : (
                              <Shield className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                          <span className="font-medium">{clube.nome}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveClube(clube.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Nenhum clube adicionado ainda.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab('info')}>
              Voltar
            </Button>
            <Button onClick={() => setActiveTab('atletas')} disabled={clubes.length === 0}>
              Próximo: Adicionar Atletas
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="atletas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Atletas do Campeonato
              </CardTitle>
              <CardDescription>
                Adicione os jogadores de cada clube.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Adicionar Atleta */}
              <div className="space-y-4">
                <h4 className="font-medium">Adicionar Novo Atleta</h4>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="atletaNome">Nome do Atleta *</FieldLabel>
                    <Input
                      id="atletaNome"
                      placeholder="Ex: Neymar Jr"
                      value={novoAtleta.nome}
                      onChange={(e) => setNovoAtleta({ ...novoAtleta, nome: e.target.value })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="atletaPosicao">Posição *</FieldLabel>
                    <Select
                      value={novoAtleta.posicao}
                      onValueChange={(value) => setNovoAtleta({ ...novoAtleta, posicao: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a posição" />
                      </SelectTrigger>
                      <SelectContent>
                        {posicaoOptions.map((posicao) => (
                          <SelectItem key={posicao} value={posicao}>
                            {posicaoLabels[posicao]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="atletaClube">Clube *</FieldLabel>
                    <Select
                      value={novoAtleta.clubeId}
                      onValueChange={(value) => setNovoAtleta({ ...novoAtleta, clubeId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o clube" />
                      </SelectTrigger>
                      <SelectContent>
                        {clubes.map((clube) => (
                          <SelectItem key={clube.id} value={clube.id}>
                            {clube.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="precoInicial">Preco Inicial (C$)</FieldLabel>
                    <Input
                      id="precoInicial"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={novoAtleta.precoInicial || ''}
                      onChange={(e) => setNovoAtleta({ ...novoAtleta, precoInicial: parseFloat(e.target.value) || 0 })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Foto do Atleta (opcional)</FieldLabel>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground">
                        Clique para fazer upload
                      </p>
                    </div>
                  </Field>
                  <Button
                    onClick={handleAddAtleta}
                    disabled={!novoAtleta.nome.trim() || !novoAtleta.posicao || !novoAtleta.clubeId}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Atleta
                  </Button>
                </FieldGroup>
              </div>

              <Separator />

              {/* Lista de Atletas */}
              <div className="space-y-4">
                <h4 className="font-medium">Atletas Adicionados ({atletas.length})</h4>
                {atletas.length > 0 ? (
                  <div className="space-y-3">
                    {clubes.map((clube) => {
                      const atletasClube = atletas.filter(a => a.clubeId === clube.id)
                      if (atletasClube.length === 0) return null

                      return (
                        <div key={clube.id} className="space-y-2">
                          <h5 className="font-medium text-sm flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            {clube.nome}
                          </h5>
                          <div className="grid gap-2 md:grid-cols-2">
                            {atletasClube.map((atleta) => (
                              <div key={atleta.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                    {atleta.foto ? (
                                      <img src={atleta.foto} alt={atleta.nome} className="w-6 h-6 object-cover rounded-full" />
                                    ) : (
                                      <User className="w-4 h-4 text-muted-foreground" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">{atleta.nome}</p>
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-xs">{posicaoLabels[atleta.posicao] ?? atleta.posicao}</Badge>
                                      <span className="text-xs text-muted-foreground">C$ {atleta.precoInicial.toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveAtleta(atleta.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Nenhum atleta adicionado ainda.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab('clubes')}>
              Voltar
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Criando...' : 'Criar Campeonato'}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}