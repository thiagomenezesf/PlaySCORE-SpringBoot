'use client'

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Shield, Upload, Users, Plus, Trash2, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { mockAtletas, mockClubes, mockCampeonatos } from '@/mocks/database'
import { useAuth } from '@/hooks/use-auth'
import type { Atleta, Campeonato, Clube } from '@/types'
import { posicaoLabels, tipoJogoOptions, posicoesPorTipoJogo } from '@/lib/jogo-config'

export default function GerenciarCampeonatoPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()
  const campeonato = (mockCampeonatos as Campeonato[]).find((camp) => camp.id === Number(id))

  const [formData, setFormData] = useState(() => ({
    nome: campeonato?.nome ?? '',
    descricao: (campeonato as Campeonato | undefined)?.descricao ?? '',
    tipoJogo: campeonato?.tipoJogo ?? 'CAMPO',
    status: (campeonato as Campeonato | undefined)?.status ?? 'ativo',
  }))

  const [activeTab, setActiveTab] = useState('info')
  const [novoClube, setNovoClube] = useState({ nome: '', sigla: '', logo: '' })
  const [novoAtleta, setNovoAtleta] = useState({ nome: '', posicao: '', precoInicial: '', clubeId: '', foto: '' })
  const [clubeFiltro, setClubeFilro] = useState<number | 'ALL'>('ALL')

  const [editingClubeId, setEditingClubeId] = useState<number | null>(null)

  const [editClube, setEditClube] = useState({
    nome: '',
    sigla: '',
    logo: '',
  })

  const [editingAtletaId, setEditingAtletaId] = useState<number | null>(null)

  const [editAtleta, setEditAtleta] = useState({
    nome: '',
    posicao: '',
    precoInicial: '',
    clubeId: '',
    foto: '',
  })

  if (!campeonato) {
    return <div className="p-6">Campeonato não encontrado</div>
  }

  const isOwner = campeonato.idUsuario === user?.id
  const clubes = (mockClubes as Clube[]).filter((clube) => clube.idCampeonato === campeonato.id)
  const atletas = (mockAtletas as Atleta[]).filter((atleta) => clubes.some((clube) => clube.id === atleta.idClube))
  const atletasFiltrados = clubeFiltro === 'ALL' ? atletas : atletas.filter(a => a.idClube === clubeFiltro)
  const posicaoOptions = posicoesPorTipoJogo[formData.tipoJogo] ?? ['GOL', 'ZAG', 'LAT', 'MEI', 'ATA']

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!isOwner) return

    await new Promise((resolve) => setTimeout(resolve, 800))
    navigate(`/campeonatos/${campeonato.id}`)
  }

  const handleAddClube = () => {
    console.log('Adicionando clube:', novoClube)
    setNovoClube({ nome: '', sigla: '', logo: '' })
  }

  const handleEditClube = (clube: Clube) => {
    setEditingClubeId(clube.id)

    setEditClube({
      nome: clube.nome,
      sigla: clube.sigla ?? '',
      logo: clube.logo ?? '',
    })
  }

  const handleSaveClube = () => {
    console.log('Salvando clube:', editClube)

    setEditingClubeId(null)
  }

  const handleAddAtleta = () => {
    console.log('Adicionando atleta:', novoAtleta)
    setNovoAtleta({ nome: '', posicao: '', precoInicial: '', clubeId: '', foto: '' })
  }

  const handleEditAtleta = (atleta: Atleta) => {
    setEditingAtletaId(atleta.id)

    setEditAtleta({
      nome: atleta.nome,
      posicao: atleta.posicao,
      precoInicial: atleta.precoInicial.toString(),
      clubeId: atleta.idClube.toString(),
      foto: atleta.foto ?? '',
    })
  }

  const handleSaveAtleta = () => {
    console.log('Salvando atleta:', editAtleta)

    setEditingAtletaId(null)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/campeonatos/${campeonato.id}`)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-display font-bold">Gerenciar Campeonato</h1>
          <p className="text-muted-foreground">
            Ajuste o campeonato e gerencie clubes e atletas cadastrados.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="clubes">Clubes</TabsTrigger>
          <TabsTrigger value="atletas">Atletas</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Informações do Campeonato
                </CardTitle>
                <CardDescription>Atualize os principais dados do campeonato.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="nome">Nome do Campeonato</FieldLabel>
                      <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        disabled={!isOwner}
                        required
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="descricao">Descrição</FieldLabel>
                      <Textarea
                        id="descricao"
                        rows={4}
                        value={formData.descricao}
                        onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                        disabled={!isOwner}
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="tipoJogo">Tipo de Jogo</FieldLabel>
                      <Select
                        value={formData.tipoJogo}
                        onValueChange={(value) => setFormData({ ...formData, tipoJogo: value as 'CAMPO' | 'FUTSAL' | 'FUT7' })}
                        disabled={!isOwner}
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
                        <p className="text-sm text-muted-foreground">Clique para fazer upload ou arraste uma imagem</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG até 2MB</p>
                      </div>
                    </Field>
                  </FieldGroup>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="button" variant="outline" onClick={() => navigate(`/campeonatos/${campeonato.id}`)}>
                      Voltar
                    </Button>
                    <Button type="submit" disabled={!isOwner} className="w-full sm:w-auto">
                      Salvar Alterações
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Resumo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Clubes</span>
                    <span>{clubes.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Atletas</span>
                    <span>{atletas.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Status</span>
                    <Badge variant="secondary">{formData.status === 'ativo' ? 'Ativo' : formData.status === 'finalizado' ? 'Finalizado' : 'Inativo'}</Badge>
                  </div>
                  <div className="rounded-lg border border-border p-4 bg-muted/50">
                    <p className="text-sm text-muted-foreground">Apenas o criador pode editar este campeonato.</p>
                    {isOwner ? (
                      <p className="text-sm text-foreground">Você tem permissão total.</p>
                    ) : (
                      <p className="text-sm text-red-500">Somente leitura para este usuário.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="clubes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Novo Clube</CardTitle>
              <CardDescription>Crie um novo clube para o campeonato.</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="clubeNome">Nome do Clube</FieldLabel>
                  <Input
                    id="clubeNome"
                    placeholder="Ex: Corinthians"
                    value={novoClube.nome}
                    onChange={(e) => setNovoClube({ ...novoClube, nome: e.target.value })}
                    disabled={!isOwner}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="clubeSigla">Sigla</FieldLabel>
                  <Input
                    id="clubeSigla"
                    placeholder="Ex: COR"
                    maxLength={3}
                    value={novoClube.sigla}
                    onChange={(e) => setNovoClube({ ...novoClube, sigla: e.target.value })}
                    disabled={!isOwner}
                  />
                </Field>

                <Field>
                  <FieldLabel>Foto do Clube (opcional)</FieldLabel>

                  <label className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer block">
                    <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />

                    <p className="text-xs text-muted-foreground">
                      Clique para fazer upload
                    </p>

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={!isOwner}
                      onChange={(e) => {
                        const file = e.target.files?.[0]

                        if (file) {
                          const imageUrl = URL.createObjectURL(file)

                          setNovoClube({
                            ...novoClube,
                            logo: imageUrl,
                          })
                        }
                      }}
                    />
                  </label>

                  {novoClube.logo && (
                    <img
                      src={novoClube.logo}
                      alt="Preview do clube"
                      className="mt-4 h-24 w-24 object-cover rounded-lg border"
                    />
                  )}
                </Field>

                <Button onClick={handleAddClube} disabled={!isOwner || !novoClube.nome}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Clube
                </Button>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Clubes Cadastrados</CardTitle>
              <CardDescription>Listagem dos clubes no campeonato.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Sigla</TableHead>
                    <TableHead className="text-right">Atletas</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
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
                        <TableCell>{clube.sigla ?? '-'}</TableCell>
                        <TableCell className="text-right">{atletaCount}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={!isOwner}
                              onClick={() => handleEditClube(clube)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <Button variant="ghost" size="sm" disabled={!isOwner}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              {editingClubeId && (
                <div className="mt-6 border rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold">Editar Clube</h3>

                  <FieldGroup>
                    <Field>
                      <FieldLabel>Nome</FieldLabel>

                      <Input
                        value={editClube.nome}
                        onChange={(e) =>
                          setEditClube({
                            ...editClube,
                            nome: e.target.value,
                          })
                        }
                      />
                    </Field>

                    <Field>
                      <FieldLabel>Sigla</FieldLabel>

                      <Input
                        value={editClube.sigla}
                        onChange={(e) =>
                          setEditClube({
                            ...editClube,
                            sigla: e.target.value,
                          })
                        }
                      />
                    </Field>

                    <Field>
                      <FieldLabel>Foto do Clube</FieldLabel>

                      <label className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer block">
                        <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />

                        <p className="text-xs text-muted-foreground">
                          Clique para fazer upload
                        </p>

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]

                            if (file) {
                              const imageUrl = URL.createObjectURL(file)

                              setEditClube({
                                ...editClube,
                                logo: imageUrl,
                              })
                            }
                          }}
                        />
                      </label>

                      {editClube.logo && (
                        <img
                          src={editClube.logo}
                          alt="Preview"
                          className="mt-4 h-24 w-24 object-cover rounded-lg border"
                        />
                      )}
                    </Field>

                    <div className="flex gap-2">
                      <Button onClick={handleSaveClube}>
                        Salvar
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => setEditingClubeId(null)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </FieldGroup>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="atletas" className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium">Filtrar por clube:</span>
            <Select value={clubeFiltro.toString()} onValueChange={(value) => setClubeFilro(value === 'ALL' ? 'ALL' : Number(value))}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Selecione um clube" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos os clubes</SelectItem>
                {clubes.map((clube) => (
                  <SelectItem key={clube.id} value={clube.id.toString()}>
                    {clube.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Adicionar Novo Atleta</CardTitle>
              <CardDescription>Cadastre um novo jogador no campeonato.</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="atletaNome">Nome do Atleta</FieldLabel>
                  <Input
                    id="atletaNome"
                    placeholder="Ex: João Silva"
                    value={novoAtleta.nome}
                    onChange={(e) => setNovoAtleta({ ...novoAtleta, nome: e.target.value })}
                    disabled={!isOwner}
                  />
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="atletaPosicao">Posição</FieldLabel>
                    <Select
                      value={novoAtleta.posicao}
                      onValueChange={(value) => setNovoAtleta({ ...novoAtleta, posicao: value })}
                      disabled={!isOwner}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a posição" />
                      </SelectTrigger>
                      <SelectContent>
                        {posicaoOptions.map((value) => (
                          <SelectItem key={value} value={value}>
                            {posicaoLabels[value]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="atletaClube">Clube</FieldLabel>
                    <Select
                      value={novoAtleta.clubeId}
                      onValueChange={(value) => setNovoAtleta({ ...novoAtleta, clubeId: value })}
                      disabled={!isOwner}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um clube" />
                      </SelectTrigger>
                      <SelectContent>
                        {clubes.map((clube) => (
                          <SelectItem key={clube.id} value={clube.id.toString()}>
                            {clube.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="atletaPreco">Preço Inicial</FieldLabel>
                  <Input
                    id="atletaPreco"
                    type="number"
                    placeholder="Ex: 10.5"
                    step={0.1}
                    value={novoAtleta.precoInicial}
                    onChange={(e) => setNovoAtleta({ ...novoAtleta, precoInicial: e.target.value })}
                    disabled={!isOwner}
                  />
                </Field>

                <Field>
                  <FieldLabel>Foto do Atleta (opcional)</FieldLabel>

                  <label className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer block">
                    <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />

                    <p className="text-xs text-muted-foreground">
                      Clique para fazer upload
                    </p>

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={!isOwner}
                      onChange={(e) => {
                        const file = e.target.files?.[0]

                        if (file) {
                          const imageUrl = URL.createObjectURL(file)

                          setNovoAtleta({
                            ...novoAtleta,
                            foto: imageUrl,
                          })
                        }
                      }}
                    />
                  </label>

                  {novoAtleta.foto && (
                    <img
                      src={novoAtleta.foto}
                      alt="Preview do atleta"
                      className="mt-4 h-24 w-24 object-cover rounded-lg border"
                    />
                  )}
                </Field>

                <Button onClick={handleAddAtleta} disabled={!isOwner || !novoAtleta.nome || !novoAtleta.posicao || !novoAtleta.clubeId}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Atleta
                </Button>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Atletas Cadastrados</CardTitle>
              <CardDescription>Listagem de todos os jogadores no campeonato.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Atleta</TableHead>
                    <TableHead>Posição</TableHead>
                    <TableHead>Clube</TableHead>
                    <TableHead className="text-right">Preço</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {atletasFiltrados.map((atleta) => {
                    const clube = clubes.find((c) => c.id === atleta.idClube)
                    return (
                      <TableRow key={atleta.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {atleta.foto ? (
                              <Avatar>
                                <AvatarImage src={atleta.foto} alt={atleta.nome} />
                                <AvatarFallback>{atleta.nome.charAt(0)}</AvatarFallback>
                              </Avatar>
                            ) : (
                              <Avatar>
                                <AvatarFallback>{atleta.nome.charAt(0)}</AvatarFallback>
                              </Avatar>
                            )}
                            <span>{atleta.nome}</span>
                          </div>
                        </TableCell>
                        <TableCell>{posicaoLabels[atleta.posicao] ?? atleta.posicao}</TableCell>
                        <TableCell>{clube?.nome ?? '-'}</TableCell>
                        <TableCell className="text-right">C$ {atleta.precoInicial}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={!isOwner}
                              onClick={() => handleEditAtleta(atleta)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <Button variant="ghost" size="sm" disabled={!isOwner}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              {editingAtletaId && (
                <div className="mt-6 border rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold">Editar Atleta</h3>

                  <FieldGroup>
                    <Field>
                      <FieldLabel>Nome</FieldLabel>

                      <Input
                        value={editAtleta.nome}
                        onChange={(e) =>
                          setEditAtleta({
                            ...editAtleta,
                            nome: e.target.value,
                          })
                        }
                      />
                    </Field>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field>
                      <FieldLabel>Posição</FieldLabel>

                      <Select
                        value={editAtleta.posicao}
                        onValueChange={(value) =>
                          setEditAtleta({
                            ...editAtleta,
                            posicao: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a posição" />
                        </SelectTrigger>

                        <SelectContent>
                          {posicaoOptions.map((value) => (
                            <SelectItem key={value} value={value}>
                              {posicaoLabels[value]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field>
                      <FieldLabel>Clube</FieldLabel>

                      <Select
                        value={editAtleta.clubeId}
                        onValueChange={(value) =>
                          setEditAtleta({
                            ...editAtleta,
                            clubeId: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um clube" />
                        </SelectTrigger>

                        <SelectContent>
                          {clubes.map((clube) => (
                            <SelectItem key={clube.id} value={clube.id.toString()}>
                              {clube.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>

                    <Field>
                      <FieldLabel>Preço Inicial</FieldLabel>

                      <Input
                        type="number"
                        value={editAtleta.precoInicial}
                        onChange={(e) =>
                          setEditAtleta({
                            ...editAtleta,
                            precoInicial: e.target.value,
                          })
                        }
                      />
                    </Field>

                    <Field>
                      <FieldLabel>Foto do Atleta</FieldLabel>

                      <label className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer block">
                        <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />

                        <p className="text-xs text-muted-foreground">
                          Clique para fazer upload
                        </p>

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]

                            if (file) {
                              const imageUrl = URL.createObjectURL(file)

                              setEditAtleta({
                                ...editAtleta,
                                foto: imageUrl,
                              })
                            }
                          }}
                        />
                      </label>

                      {editAtleta.foto && (
                        <img
                          src={editAtleta.foto}
                          alt="Preview"
                          className="mt-4 h-24 w-24 object-cover rounded-lg border"
                        />
                      )}
                    </Field>

                    <div className="flex gap-2">
                      <Button onClick={handleSaveAtleta}>
                        Salvar
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => setEditingAtletaId(null)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </FieldGroup>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
