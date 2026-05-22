'use client'

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Shield, Settings, Copy, Trophy, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockCampeonatos, mockEquipeLiga, mockEquipesFantasy, mockLigas, mockRegraPontuacaoLiga } from '@/mocks/database'
import { useAuth } from '@/hooks/use-auth'
import type { Campeonato, EquipeFantasy, Liga } from '@/types'
import { acoesPontuacao } from '@/lib/jogo-config'

export default function GerenciarLigaPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()
  const liga = (mockLigas as Liga[]).find((item) => item.id === Number(id))

  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('info')
  const [formData, setFormData] = useState(() => ({
    nome: liga?.nome ?? '',
    descricao: (liga as Liga | undefined)?.descricao ?? '',
    idCampeonato: liga?.idCampeonato.toString() ?? '',
    maxParticipantes: (liga as Liga | undefined)?.maxParticipantes?.toString() ?? '20',
    codigoAcesso: (liga as Liga | undefined)?.codigoAcesso.toString() ?? ''
  }))

  const regrasIniciais: { [key: string]: number } = {}

  if (liga) {
    mockRegraPontuacaoLiga.forEach((r) => {
      if (r.idLiga === liga.id) {
        regrasIniciais[r.acao] = r.valor
      }
    })
  }

  const [regrasPontuacao, setRegrasPontuacao] = useState<{ [key: string]: number }>(
    regrasIniciais
  )

  const [selectedAcoes, setSelectedAcoes] = useState<string[]>(
    Object.keys(regrasIniciais)
  )

  if (!liga) {
    return <div className="p-6">Liga não encontrada</div>
  }

  const campeonato = (mockCampeonatos as Campeonato[]).find(
    (camp) => camp.id === liga.idCampeonato
  )

  const isOwner = liga.idUsuarioCriador === user?.id

  const participantes = mockEquipeLiga.filter(
    (entry) => entry.idLiga === liga!.id
  ).length

  const equipes = (mockEquipesFantasy as EquipeFantasy[]).filter((equipe) =>
    mockEquipeLiga.some(
      (entry) =>
        entry.idEquipeFantasy === equipe.id &&
        entry.idLiga === liga!.id
    )
  )

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!isOwner) return

    await new Promise((resolve) => setTimeout(resolve, 800))

    navigate(`/ligas/${liga.id}`)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(liga.codigoAcesso)

    setCopied(true)

    setTimeout(() => setCopied(false), 1400)
  }

  const handleAddAcao = (acaoId: string) => {
    if (!selectedAcoes.includes(acaoId)) {
      setSelectedAcoes([...selectedAcoes, acaoId])

      setRegrasPontuacao({
        ...regrasPontuacao,
        [acaoId]: 0
      })
    }
  }

  const handleRemoveAcao = (acaoId: string) => {
    setSelectedAcoes(
      selectedAcoes.filter((id) => id !== acaoId)
    )

    const novasRegras = { ...regrasPontuacao }

    delete novasRegras[acaoId]

    setRegrasPontuacao(novasRegras)
  }

  const handlePontuacaoChange = (acaoId: string, pontos: number) => {
    setRegrasPontuacao({
      ...regrasPontuacao,
      [acaoId]: pontos
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/ligas/${liga.id}`)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div>
          <h1 className="text-2xl font-display font-bold">
            Gerenciar Liga
          </h1>

          <p className="text-muted-foreground">
            Atualize as informações da liga e revise os dados de participação.
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="info">
            Informações
          </TabsTrigger>

          <TabsTrigger value="regras">
            Regras de Pontuação
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Dados da Liga
                </CardTitle>

                <CardDescription>
                  Edite o nome, descrição e o campeonato vinculado.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="nome">
                        Nome da Liga
                      </FieldLabel>

                      <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nome: e.target.value
                          })
                        }
                        disabled={!isOwner}
                        required
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="descricao">
                        Descrição
                      </FieldLabel>

                      <Textarea
                        id="descricao"
                        rows={4}
                        value={formData.descricao}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            descricao: e.target.value
                          })
                        }
                        disabled={!isOwner}
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="campeonato">
                        Campeonato
                      </FieldLabel>

                      <Select
                        value={formData.idCampeonato}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            idCampeonato: value
                          })
                        }
                        disabled={!isOwner}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um campeonato" />
                        </SelectTrigger>

                        <SelectContent>
                          {mockCampeonatos.map((camp) => (
                            <SelectItem
                              key={camp.id}
                              value={camp.id.toString()}
                            >
                              {camp.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="maxParticipantes">
                        Máximo de Participantes
                      </FieldLabel>

                      <Input
                        id="maxParticipantes"
                        type="number"
                        min={2}
                        value={formData.maxParticipantes}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            maxParticipantes: e.target.value
                          })
                        }
                        disabled={!isOwner}
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="codigoAcesso">
                        Código de Acesso
                      </FieldLabel>

                      <Input
                        id="codigoAcesso"
                        value={formData.codigoAcesso}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            codigoAcesso: e.target.value
                          })
                        }
                        disabled={!isOwner}
                        required
                      />
                    </Field>
                  </FieldGroup>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        navigate(`/ligas/${liga.id}`)
                      }
                    >
                      Cancelar
                    </Button>

                    <Button
                      type="submit"
                      disabled={!isOwner}
                      className="w-full sm:w-auto"
                    >
                      Salvar Alterações
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="space-y-3">
                <CardHeader>
                  <CardTitle>
                    Resumo da Liga
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Código de Acesso
                      </p>

                      <p className="font-medium">
                        {liga.codigoAcesso}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyCode}
                    >
                      <Copy className="mr-2 h-4 w-4" />

                      {copied ? 'Copiado' : 'Copiar'}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Campeonato</span>

                      <span>
                        {campeonato?.nome ?? 'Não vinculado'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Participantes</span>

                      <span>{participantes}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Equipes</span>

                      <span>
                        {equipes.length}/{liga.maxParticipantes}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Status</span>

                      <Badge variant="secondary">
                        Ativa
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    Permissão
                  </CardTitle>

                  <CardDescription>
                    {isOwner
                      ? 'Você é o criador desta liga.'
                      : 'Apenas o criador pode editar os dados da liga.'}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />

                    <span>
                      {isOwner
                        ? 'Proprietário'
                        : 'Somente leitura'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="regras" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Regras de Pontuação
              </CardTitle>

              <CardDescription>
                Selecione as ações que darão pontos nesta liga
              </CardDescription>
            </CardHeader>

            <CardContent>
              <FieldGroup className="space-y-4">
                <Field>
                  <FieldLabel>
                    Regras de Pontuação
                  </FieldLabel>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Selecione as ações que darão pontos na sua liga e defina a pontuação para cada uma.
                      </p>

                      <div className="grid gap-2">
                        {acoesPontuacao.map((acao) => (
                          <div
                            key={acao.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-sm">
                                {acao.nome}
                              </p>

                              <p className="text-xs text-muted-foreground">
                                {acao.descricao}
                              </p>
                            </div>

                            {selectedAcoes.includes(acao.id) ? (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={!isOwner}
                                onClick={() =>
                                  handleRemoveAcao(acao.id)
                                }
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={!isOwner}
                                onClick={() =>
                                  handleAddAcao(acao.id)
                                }
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedAcoes.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm">
                          Pontuação Definida
                        </h4>

                        {selectedAcoes.map((acaoId) => {
                          const acao = acoesPontuacao.find(
                            (a) => a.id === acaoId
                          )!

                          return (
                            <div
                              key={acaoId}
                              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                            >
                              <Badge variant="secondary">
                                {acao.nome}
                              </Badge>

                              <Input
                                type="number"
                                placeholder="Pontos"
                                className="w-24"
                                disabled={!isOwner}
                                value={
                                  regrasPontuacao[acaoId] || ''
                                }
                                onChange={(e) =>
                                  handlePontuacaoChange(
                                    acaoId,
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                              />

                              <span className="text-sm text-muted-foreground">
                                pontos
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}