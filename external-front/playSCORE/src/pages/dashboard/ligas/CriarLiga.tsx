'use client'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Trophy, Upload, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { mockCampeonatos } from '@/mocks/database'
import { acoesPontuacao } from '@/lib/jogo-config'
export default function CriarLigaPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    idCampeonato: '',
    maxParticipantes: '20',
  })
  const [regrasPontuacao, setRegrasPontuacao] = useState<{[key: string]: number}>({})
  const [selectedAcoes, setSelectedAcoes] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // TODO: Integrar com Spring Boot via Axios
    await new Promise(resolve => setTimeout(resolve, 1000))

    navigate('/ligas')
  }

  const handleAddAcao = (acaoId: string) => {
    if (!selectedAcoes.includes(acaoId)) {
      setSelectedAcoes([...selectedAcoes, acaoId])
      setRegrasPontuacao({ ...regrasPontuacao, [acaoId]: 0 })
    }
  }

  const handleRemoveAcao = (acaoId: string) => {
    setSelectedAcoes(selectedAcoes.filter(id => id !== acaoId))
    const newRegras = { ...regrasPontuacao }
    delete newRegras[acaoId]
    setRegrasPontuacao(newRegras)
  }

  const handlePontuacaoChange = (acaoId: string, pontos: number) => {
    setRegrasPontuacao({ ...regrasPontuacao, [acaoId]: pontos })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/ligas')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-display font-bold">Criar Nova Liga</h1>
          <p className="text-muted-foreground">
            Configure sua liga e convide seus amigos para participar.
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Informacoes da Liga
          </CardTitle>
          <CardDescription>
            Preencha os dados basicos da sua nova liga.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="nome">Nome da Liga *</FieldLabel>
                <Input
                  id="nome"
                  placeholder="Ex: Liga dos Amigos"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="descricao">Descrição</FieldLabel>
                <Textarea
                  id="descricao"
                  placeholder="Descreva sua liga..."
                  rows={3}
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="campeonato">Campeonato *</FieldLabel>
                <Select
                  value={formData.idCampeonato}
                  onValueChange={(value) => setFormData({ ...formData, idCampeonato: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um campeonato" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCampeonatos.map((camp) => (
                      <SelectItem key={camp.id} value={camp.id.toString()}>
                        {camp.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  A liga sera vinculada a este campeonato.
                </p>
              </Field>

              <Field>
                <FieldLabel htmlFor="maxParticipantes">Maximo de Participantes</FieldLabel>
                <Input
                  id="maxParticipantes"
                  type="number"
                  min="2"
                  max="100"
                  value={formData.maxParticipantes}
                  onChange={(e) => setFormData({ ...formData, maxParticipantes: e.target.value })}
                />
              </Field>

              <Field>
                <FieldLabel>Logo da Liga (opcional)</FieldLabel>
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

              {/* Regras de Pontuação */}
              <Field>
                <FieldLabel>Regras de Pontuacao</FieldLabel>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Selecione as acoes que darao pontos na sua liga e defina a pontuacao para cada uma.
                    </p>
                    <div className="grid gap-2">
                      {acoesPontuacao.map((acao) => (
                        <div key={acao.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{acao.nome}</p>
                            <p className="text-xs text-muted-foreground">{acao.descricao}</p>
                          </div>
                          {selectedAcoes.includes(acao.id) ? (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveAcao(acao.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAddAcao(acao.id)}
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
                      <h4 className="font-medium text-sm">Pontuacao Definida</h4>
                      {selectedAcoes.map((acaoId) => {
                        const acao = acoesPontuacao.find(a => a.id === acaoId)!
                        return (
                          <div key={acaoId} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <Badge variant="secondary">{acao.nome}</Badge>
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
                    </div>
                  )}
                </div>
              </Field>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => navigate('/ligas')}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? 'Criando...' : 'Criar Liga'}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}