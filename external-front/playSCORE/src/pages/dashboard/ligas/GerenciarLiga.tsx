'use client'

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Shield, Copy, Trophy, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/hooks/use-auth'
import api from '@/lib/api'
import type { Campeonato } from '@/types'
import { acoesPontuacao } from '@/lib/jogo-config'

export default function GerenciarLigaPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()
  const [liga, setLiga] = useState<any>(null)
  const [campeonatos, setCampeonatos] = useState<Campeonato[]>([])
  const [equipeLiga, setEquipeLiga] = useState<any[]>([])
  const [regras, setRegras] = useState<any[]>([])

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    idCampeonato: '',
    maxParticipantes: '20',
    codigoAcesso: '',
  })
  const [selectedAcoes, setSelectedAcoes] = useState<string[]>([])
  const [regrasPontuacao, setRegrasPontuacao] = useState<Record<string, number>>({})
  const [activeTab, setActiveTab] = useState<'info' | 'regras'>('info')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      if (!id) return
      setIsLoading(true)

      try {
        const [currentLiga, campeonatosData, equipeLigaData, regrasData] = await Promise.all([
          api.getLiga(Number(id)),
          api.listCampeonatos(),
          api.listEquipeLiga(),
          api.listRegraPontuacaoLiga(),
        ])

        if (currentLiga) {
          setLiga(currentLiga)
          setFormData({
            nome: currentLiga.nome,
            descricao: currentLiga.descricao || '',
            idCampeonato: String(currentLiga.idCampeonato),
            maxParticipantes: String(currentLiga.maximoParticipantes || 20),
            codigoAcesso: currentLiga.codigoAcesso,
          })

          const leagueRules = regrasData.filter((regra: any) => regra.liga?.id === currentLiga.id)
          setRegras(leagueRules)
          setSelectedAcoes(leagueRules.map((regra: any) => regra.acao))
          setRegrasPontuacao(
            leagueRules.reduce((acc: Record<string, number>, regra: any) => {
              acc[regra.acao] = regra.valor
              return acc
            }, {})
          )
        }

        setCampeonatos(campeonatosData)
        setEquipeLiga(equipeLigaData.filter((entry: any) => entry.idLiga === Number(id)))
      } catch (error) {
        console.error('Erro ao carregar dados da liga', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [id])

  const isOwner = user?.id != null && liga?.criador?.id === user.id
  const participantes = equipeLiga.length
  const campeonato = campeonatos.find((camp) => camp.id === Number(formData.idCampeonato))

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()
    console.log("ENTROU NO HANDLE SAVE")

    event.preventDefault()

    console.log("isOwner:", isOwner)
    console.log("liga:", liga)

    if (!isOwner || !liga) return

    console.log("PASSOU NO IF")
    setIsSaving(true)

    try {
      console.log('DADOS ENVIADOS:', {
        nome: formData.nome,
        descricao: formData.descricao,
        idCampeonato: Number(formData.idCampeonato),
        maxParticipantes: Number(formData.maxParticipantes),
        codigoAcesso: formData.codigoAcesso,
        idUsuarioCriador: liga.criador?.id,
      })

      const updated = await api.updateLiga(liga.id, {
        nome: formData.nome,
        descricao: formData.descricao,
        idCampeonato: Number(formData.idCampeonato),
        maximoParticipantes: Number(formData.maxParticipantes),
        codigoAcesso: formData.codigoAcesso,
        idUsuarioCriador: user.id,
      })

      setLiga(updated)
      setFormData({
        nome: updated.nome,
        descricao: updated.descricao || '',
        idCampeonato: String(updated.idCampeonato),
        maxParticipantes: String(updated.maximoParticipantes || 20),
        codigoAcesso: updated.codigoAcesso,
      })
      alert('Liga atualizada com sucesso.')
    } catch (error) {
      console.error('Erro ao atualizar liga', error)
      alert('Não foi possível atualizar a liga.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveRules = async () => {
    if (!isOwner || !liga) return

    setIsSaving(true)

    try {

      for (const acao of selectedAcoes) {

        const regraExistente = regras.find(
          (r) => r.acao === acao
        )

        if (regraExistente) {

          await api.updateRegraPontuacaoLiga(
            regraExistente.id,
            {
              id: regraExistente.id,
              acao,
              valor: Number(regrasPontuacao[acao] || 0),
              liga: {
                id: liga.id
              }
            }
          )

        } else {

          await api.createRegraPontuacaoLiga({
            acao,
            valor: Number(regrasPontuacao[acao] || 0),
            idLiga: liga.id
          })

        }
      }

      const allRules = await api.listRegraPontuacaoLiga()

      const leagueRules = allRules.filter(
        (regra: any) => regra.liga?.id === liga.id
      )

      setRegras(leagueRules)

      alert('Regras atualizadas com sucesso.')

    } catch (error) {

      console.error('Erro ao salvar regras', error)

      alert('Não foi possível salvar as regras.')

    } finally {

      setIsSaving(false)

    }
  }

  const handleDelete = async () => {
    if (!isOwner || !liga) return
    if (!window.confirm('Tem certeza que deseja excluir esta liga? Isso não pode ser desfeito.')) {
      return
    }

    setIsDeleting(true)
    try {
      await api.deleteLiga(liga.id)
      navigate('/ligas')
    } catch (error) {
      console.error('Erro ao excluir liga', error)
      alert('Não foi possível excluir a liga.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCopyCode = () => {
    if (!liga?.codigoAcesso) return
    navigator.clipboard.writeText(liga.codigoAcesso)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleAddAcao = (acaoId: string) => {
    if (!selectedAcoes.includes(acaoId)) {
      setSelectedAcoes([...selectedAcoes, acaoId])
      setRegrasPontuacao({ ...regrasPontuacao, [acaoId]: 0 })
    }
  }

  const handleRemoveAcao = async (acaoId: string) => {

    const regraExistente = regras.find(
      r => r.acao === acaoId
    )

    if (regraExistente) {

      try {

        await api.deleteRegraPontuacaoLiga(
          regraExistente.id
        )

        setRegras(
          regras.filter(
            r => r.id !== regraExistente.id
          )
        )

      } catch (error) {

        console.error(error)
        alert('Erro ao remover regra')

        return
      }
    }

    setSelectedAcoes(
      selectedAcoes.filter(
        acao => acao !== acaoId
      )
    )

    const novasRegras = { ...regrasPontuacao }

    delete novasRegras[acaoId]

    setRegrasPontuacao(novasRegras)
  }

  const handlePontuacaoChange = (acaoId: string, pontos: number) => {
    setRegrasPontuacao({ ...regrasPontuacao, [acaoId]: pontos })
  }

  if (isLoading) {
    return <div className="flex items-center justify-center py-12">Carregando...</div>
  }

  if (!liga) {
    return <div className="flex items-center justify-center py-12">Liga não encontrada</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/ligas/${liga.id}`)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div>
          <h1 className="text-2xl font-display font-bold">Gerenciar Liga</h1>
          <p className="text-muted-foreground">Atualize as informações e visualize os dados da sua liga.</p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as 'info' | 'regras')}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="regras">Regras</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Dados da Liga
                </CardTitle>
                <CardDescription>Edite o nome, descrição e o campeonato vinculado.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="nome">Nome da Liga</FieldLabel>
                      <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(event) => setFormData({ ...formData, nome: event.target.value })}
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
                        onChange={(event) => setFormData({ ...formData, descricao: event.target.value })}
                        disabled={!isOwner}
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="campeonato">Campeonato</FieldLabel>
                      <Select
                        value={formData.idCampeonato}
                        onValueChange={(value) => setFormData({ ...formData, idCampeonato: value })}
                        disabled={!isOwner}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um campeonato" />
                        </SelectTrigger>
                        <SelectContent>
                          {campeonatos.map((camp) => (
                            <SelectItem key={camp.id} value={camp.id.toString()}>
                              {camp.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="maxParticipantes">Máximo de Participantes</FieldLabel>
                      <Input
                        id="maxParticipantes"
                        type="number"
                        min={2}
                        value={formData.maxParticipantes}
                        onChange={(event) => setFormData({ ...formData, maxParticipantes: event.target.value })}
                        disabled={!isOwner}
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="codigoAcesso">Código de Acesso</FieldLabel>
                      <Input
                        id="codigoAcesso"
                        value={formData.codigoAcesso}
                        onChange={(event) => setFormData({ ...formData, codigoAcesso: event.target.value })}
                        disabled={!isOwner}
                        required
                      />
                    </Field>
                  </FieldGroup>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="button" variant="outline" onClick={() => navigate(`/ligas/${liga.id}`)}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={!isOwner || isSaving}>
                      {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="space-y-3">
                <CardHeader>
                  <CardTitle>Resumo da Liga</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Código de Acesso</p>
                      <p className="font-medium">{liga.codigoAcesso}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleCopyCode}>
                      <Copy className="mr-2 h-4 w-4" /> {copied ? 'Copiado' : 'Copiar'}
                    </Button>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Campeonato</span>
                      <span>{campeonato?.nome ?? 'Não vinculado'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Participantes</span>
                      <span>{participantes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status</span>
                      <Badge variant="secondary">Ativa</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {isOwner && (
                <Card>
                  <CardHeader>
                    <CardTitle>Excluir Liga</CardTitle>
                    <CardDescription>Esta ação remove a liga permanentemente.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                      {isDeleting ? 'Excluindo...' : 'Excluir Liga'}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="regras" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" /> Regras de Pontuação
              </CardTitle>
              <CardDescription>Visualize e adicione regras de pontuação para a liga.</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="space-y-4">
                <Field>
                  <FieldLabel>Regras Atuais</FieldLabel>
                  {regras.length > 0 ? (
                    <div className="space-y-2">
                      {regras.map((regra) => (
                        <div key={regra.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                          <span>{regra.acao}</span>
                          <span className="font-semibold">{regra.valor}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhuma regra configurada para esta liga.</p>
                  )}
                </Field>

                <Field>
                  <FieldLabel>Adicionar Novas Regras</FieldLabel>
                  <div className="grid gap-3">
                    {acoesPontuacao.map((acao) => (
                      <div key={acao.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{acao.nome}</p>
                          <p className="text-xs text-muted-foreground">{acao.descricao}</p>
                        </div>
                        {selectedAcoes.includes(acao.id) ? (
                          <Button type="button" variant="outline" size="sm" onClick={() => handleRemoveAcao(acao.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button type="button" variant="ghost" size="sm" onClick={() => handleAddAcao(acao.id)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </Field>

                {selectedAcoes.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Valores das Regras</h4>
                    {selectedAcoes.map((acaoId) => {
                      const acao = acoesPontuacao.find((item) => item.id === acaoId)!
                      return (
                        <div key={acaoId} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <span className="font-medium">{acao.nome}</span>
                          <Input
                            type="number"
                            placeholder="Pontos"
                            className="w-24"
                            value={regrasPontuacao[acaoId] || ''}
                            onChange={(e) => handlePontuacaoChange(acaoId, parseFloat(e.target.value) || 0)}
                          />
                          <span className="text-sm text-muted-foreground">pontos</span>
                        </div>
                      )
                    })}
                    <Button onClick={handleSaveRules} disabled={!isOwner || isSaving}>
                      {isSaving ? 'Salvando...' : 'Salvar Novas Regras'}
                    </Button>
                  </div>
                )}
              </FieldGroup>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
