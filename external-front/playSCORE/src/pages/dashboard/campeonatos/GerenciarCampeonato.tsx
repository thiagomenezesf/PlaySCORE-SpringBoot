'use client'

import { useEffect, useState } from 'react'
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
import api from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'
import type { Atleta, Campeonato, Clube, PosicaoAtleta, TipoJogo } from '@/types'
import { posicaoLabels, tipoJogoOptions, posicoesPorTipoJogo } from '@/lib/jogo-config'

export default function GerenciarCampeonatoPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()
  const [campeonatos, setCampeonatos] = useState<Campeonato[]>([])
  const [clubes, setClubes] = useState<Clube[]>([])
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [campeonatosData, clubesData, atletasData] = await Promise.all([
          api.listCampeonatos(),
          api.listClubes(),
          api.listAtletas(),
        ])
        setCampeonatos(campeonatosData)
        setClubes(clubesData)
        setAtletas(atletasData)
      } catch (error) {
        console.error('Erro ao carregar dados do campeonato', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const campeonato = campeonatos.find((camp) => camp.id === Number(id))

  const [formData, setFormData] = useState<{
    nome: string
    descricao: string
    tipoJogo: TipoJogo
    status: 'ativo' | 'inativo' | 'finalizado'
    logo: string
  }>({
    nome: '',
    descricao: '',
    tipoJogo: 'CAMPO',
    status: 'ativo',
    logo: '',
  })
  const [campeonatoLogoFile, setCampeonatoLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState('')

  useEffect(() => {
    if (campeonato) {
      setFormData({
        nome: campeonato.nome || '',
        descricao: campeonato.descricao || '',
        tipoJogo: campeonato.tipoJogo || 'CAMPO',
        status: campeonato.status || 'ativo',
        logo: campeonato.logo || '',
      })
      setLogoPreview(campeonato.logo || '')
    }
  }, [campeonato])

  const [activeTab, setActiveTab] = useState('info')
  const [novoClube, setNovoClube] = useState({ nome: '', sigla: '', logo: '', logoFile: null as File | null })
  const [novoAtleta, setNovoAtleta] = useState<{
    nome: string
    posicao: PosicaoAtleta | ''
    precoInicial: string
    clubeId: string
    foto: string
    fotoFile: File | null
  }>({ nome: '', posicao: '', precoInicial: '', clubeId: '', foto: '', fotoFile: null })
  const [clubeFiltro, setClubeFilro] = useState<number | 'ALL'>('ALL')

  const [editingClubeId, setEditingClubeId] = useState<number | null>(null)

  const [editClube, setEditClube] = useState({
    nome: '',
    sigla: '',
    logo: '',
    logoFile: null as File | null,
  })

  const [editingAtletaId, setEditingAtletaId] = useState<number | null>(null)

  const [editAtleta, setEditAtleta] = useState<{
    nome: string
    posicao: PosicaoAtleta | ''
    precoInicial: string
    clubeId: string
    foto: string
    fotoFile: File | null
  }>({
    nome: '',
    posicao: '',
    precoInicial: '',
    clubeId: '',
    foto: '',
    fotoFile: null,
  })

  if (isLoading) {
    return <div className="p-6">Carregando dados do campeonato...</div>
  }

  if (!campeonato) {
    return <div className="p-6">Campeonato não encontrado</div>
  }

  const isOwner = campeonato.idUsuario === user?.id
  const clubesDoCampeonato = clubes.filter((clube) => clube.idCampeonato === campeonato.id)
  const atletasDoCampeonato = atletas.filter((atleta) => clubesDoCampeonato.some((clube) => clube.id === atleta.idClube))
  const atletasFiltrados = clubeFiltro === 'ALL' ? atletasDoCampeonato : atletasDoCampeonato.filter(a => a.idClube === clubeFiltro)
  const posicaoOptions = posicoesPorTipoJogo[formData.tipoJogo] ?? ['GOL', 'ZAG', 'LAT', 'MEI', 'ATA']

  const uploadFile = async (file: File | null, existingUrl?: string) => {
    const isBlobUrl = existingUrl?.startsWith('blob:')
    if (!file) {
      return isBlobUrl ? '' : existingUrl ?? ''
    }

    const formData = new FormData()
    formData.append('file', file)
    const response = await api.uploadFile(formData)
    return response.url || ''
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!isOwner) return

    setIsLoading(true)
    try {
      const logoUrl = await uploadFile(campeonatoLogoFile, formData.logo)

      const payload = {
        nome: formData.nome,
        descricao: formData.descricao,
        tipoJogo: formData.tipoJogo,
        status: formData.status,
        logo: logoUrl,
        idUsuario: campeonato.idUsuario,
        numeroDeJogadoresJogando: campeonato.numeroDeJogadoresJogando,
      }

      const updated = await api.updateCampeonato(campeonato.id, payload)
      setFormData({ ...formData, logo: updated.logo ?? logoUrl })
      setLogoPreview(updated.logo ?? logoUrl)
      setIsLoading(false)
      navigate(`/campeonatos/${campeonato.id}`)
    } catch (error) {
      console.error('Erro ao salvar campeonato', error)
      alert('Não foi possível salvar o campeonato. Tente novamente.')
      setIsLoading(false)
    }
  }

  const handleDeleteCampeonato = async () => {
    if (!isOwner) return
    const confirmDelete = window.confirm('Tem certeza que deseja excluir o campeonato e todos os clubes e ligas vinculados?')
    if (!confirmDelete) return

    setIsLoading(true)
    try {
      await api.deleteCampeonato(campeonato.id)
      navigate('/campeonatos')
    } catch (error) {
      console.error('Erro ao excluir campeonato', error)
      alert('Não foi possível excluir o campeonato.')
      setIsLoading(false)
    }
  }

  const handleAddClube = async () => {
    if (!isOwner) return

    try {
      const logoUrl = await uploadFile(novoClube.logoFile, novoClube.logo)
      const payload = {
        nome: novoClube.nome,
        sigla: novoClube.sigla,
        logo: logoUrl,
        idCampeonato: campeonato.id,
      }
      const created = await api.createClube(payload)
      setClubes([...clubes, created])
      setNovoClube({ nome: '', sigla: '', logo: '', logoFile: null })
    } catch (error) {
      console.error('Erro ao criar clube', error)
      alert('Não foi possível criar o clube.')
    }
  }

  const handleEditClube = (clube: Clube) => {
    setEditingClubeId(clube.id)

    setEditClube({
      nome: clube.nome,
      sigla: clube.sigla ?? '',
      logo: clube.logo ?? '',
      logoFile: null,
    })
  }

  const handleSaveClube = async () => {
    if (!editingClubeId) return
    if (!isOwner) return

    setIsLoading(true)
    try {
      const logoUrl = await uploadFile(editClube.logoFile, editClube.logo)
      const payload = {
        nome: editClube.nome,
        sigla: editClube.sigla,
        logo: logoUrl,
        idCampeonato: campeonato.id,
      }
      const updated = await api.updateClube(editingClubeId, payload)
      setClubes(clubes.map((clube) => (clube.id === updated.id ? updated : clube)))
      setEditingClubeId(null)
    } catch (error) {
      console.error('Erro ao atualizar clube', error)
      alert('Não foi possível atualizar o clube.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddAtleta = async () => {
    if (!isOwner) return

    try {
      const fotoUrl = await uploadFile(novoAtleta.fotoFile, novoAtleta.foto)
      const payload = {
        nome: novoAtleta.nome,
        posicao: novoAtleta.posicao,
        precoInicial: parseFloat(novoAtleta.precoInicial || '0'),
        foto: fotoUrl,
        idClube: Number(novoAtleta.clubeId),
      }
      const created = await api.createAtleta(payload)
      setAtletas([...atletas, created])
      setNovoAtleta({ nome: '', posicao: '', precoInicial: '', clubeId: '', foto: '', fotoFile: null })
    } catch (error) {
      console.error('Erro ao criar atleta', error)
      alert('Não foi possível criar o atleta.')
    }
  }

  const handleEditAtleta = (atleta: Atleta) => {
    setEditingAtletaId(atleta.id)

    setEditAtleta({
      nome: atleta.nome,
      posicao: atleta.posicao,
      precoInicial: atleta.precoInicial.toString(),
      clubeId: atleta.idClube.toString(),
      foto: atleta.foto ?? '',
      fotoFile: null,
    })
  }

  const handleSaveAtleta = async () => {
    if (!editingAtletaId) return
    if (!isOwner) return

    setIsLoading(true)
    try {
      const fotoUrl = await uploadFile(editAtleta.fotoFile, editAtleta.foto)
      const payload = {
        nome: editAtleta.nome,
        posicao: editAtleta.posicao,
        precoInicial: parseFloat(editAtleta.precoInicial || '0'),
        foto: fotoUrl,
        idClube: Number(editAtleta.clubeId),
      }
      const updated = await api.updateAtleta(editingAtletaId, payload)
      setAtletas(atletas.map((atleta) => (atleta.id === updated.id ? updated : atleta)))
      setEditingAtletaId(null)
    } catch (error) {
      console.error('Erro ao atualizar atleta', error)
      alert('Não foi possível atualizar o atleta.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteClube = async (id: number) => {
    if (!isOwner) return
    const confirmDelete = window.confirm('Tem certeza que deseja excluir este clube e todos os atletas vinculados?')
    if (!confirmDelete) return

    setIsLoading(true)
    try {
      await api.deleteClube(id)
      setClubes(clubes.filter((clube) => clube.id !== id))
      setAtletas(atletas.filter((atleta) => atleta.idClube !== id))
    } catch (error) {
      console.error('Erro ao excluir clube', error)
      alert('Não foi possível excluir o clube.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAtleta = async (id: number) => {
    if (!isOwner) return
    const confirmDelete = window.confirm('Tem certeza que deseja excluir este atleta?')
    if (!confirmDelete) return

    setIsLoading(true)
    try {
      await api.deleteAtleta(id)
      setAtletas(atletas.filter((atleta) => atleta.id !== id))
    } catch (error) {
      console.error('Erro ao excluir atleta', error)
      alert('Não foi possível excluir o atleta.')
    } finally {
      setIsLoading(false)
    }
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
                      <label className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer block">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Clique para fazer upload ou arraste uma imagem</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG até 2MB</p>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={!isOwner}
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              setCampeonatoLogoFile(file)
                              setLogoPreview(URL.createObjectURL(file))
                            }
                          }}
                        />
                      </label>
                      {logoPreview && (
                        <img
                          src={logoPreview}
                          alt="Preview do logo do campeonato"
                          className="mt-4 h-24 w-24 object-cover rounded-lg border"
                        />
                      )}
                    </Field>
                  </FieldGroup>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="button" variant="outline" onClick={() => navigate(`/campeonatos/${campeonato.id}`)}>
                      Voltar
                    </Button>
                    <Button type="submit" disabled={!isOwner} className="w-full sm:w-auto">
                      Salvar Alterações
                    </Button>
                    {isOwner && (
                      <Button type="button" variant="destructive" onClick={handleDeleteCampeonato} className="w-full sm:w-auto">
                        Excluir Campeonato
                      </Button>
                    )}
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
                    <span>{clubesDoCampeonato.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Atletas</span>
                    <span>{atletasDoCampeonato.length}</span>
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
                            logoFile: file,
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
                  {clubesDoCampeonato.map((clube) => {
                    const atletaCount = atletasDoCampeonato.filter((atleta) => atleta.idClube === clube.id).length
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

                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={!isOwner}
                              onClick={() => handleDeleteClube(clube.id)}
                            >
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
                                logoFile: file,
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
                {clubesDoCampeonato.map((clube) => (
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
                      onValueChange={(value) => setNovoAtleta({ ...novoAtleta, posicao: value as PosicaoAtleta })}
                      disabled={!isOwner}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a posição" />
                      </SelectTrigger>
                      <SelectContent>
                        {posicaoOptions.map((value: PosicaoAtleta) => (
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
                        {clubesDoCampeonato.map((clube) => (
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
                            fotoFile: file,
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
                    const clube = clubesDoCampeonato.find((c) => c.id === atleta.idClube)
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

                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={!isOwner}
                              onClick={() => handleDeleteAtleta(atleta.id)}
                            >
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
                            posicao: value as PosicaoAtleta,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a posição" />
                        </SelectTrigger>

                        <SelectContent>
                          {posicaoOptions.map((value: PosicaoAtleta) => (
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
                          {clubesDoCampeonato.map((clube) => (
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
                                fotoFile: file,
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
