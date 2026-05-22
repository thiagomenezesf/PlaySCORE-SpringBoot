'use client'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil, Save, X, ArrowLeft, Upload } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'


import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/use-auth'
import { mockEquipesFantasy, mockEquipeLiga, mockLigas } from '@/mocks/database'

export default function Perfil() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const { toast } = useToast()

  const [editando, setEditando] = useState(false)

  if (!user) {
    return <div className="p-6">Carregando usuário...</div>
  }

  const equipeFantasy = mockEquipesFantasy.find(
    (e) => e.idUsuario === user.id
  )

  const [editData, setEditData] = useState({
    nomeEquipe: equipeFantasy?.nome ?? '',
    nomeUsuario: user.nome ?? '',
    logo: equipeFantasy?.logo ?? '',
  })

  const equipesNaLiga = mockEquipeLiga.filter(
    (e) => e.idEquipeFantasy === equipeFantasy?.id
  )

  const ligasCount = equipesNaLiga.length

  const pontosTotais = equipesNaLiga.reduce(
    (acc, e) => acc + (e.pontuacaoTotal || 0),
    0
  )

  let melhorLiga = { nome: '-', posicao: 0, logo: '' }

  if (equipesNaLiga.length > 0) {
    const melhor = [...equipesNaLiga].sort(
      (a, b) =>
        (b.pontuacaoTotal || 0) - (a.pontuacaoTotal || 0)
    )[0]

    const ligaInfo = mockLigas.find(
      (l) => l.id === melhor.idLiga
    )

    const participantesDaLiga = mockEquipeLiga
      .filter((el) => el.idLiga === melhor.idLiga)
      .sort(
        (a, b) =>
          (b.pontuacaoTotal || 0) - (a.pontuacaoTotal || 0)
      )

    const pos =
      participantesDaLiga.findIndex(
        (p) =>
          p.idEquipeFantasy === melhor.idEquipeFantasy
      ) + 1

    melhorLiga = {
      nome: ligaInfo?.nome || '-',
      posicao: pos || 0,
      logo: ligaInfo?.logo || '',
    }
  }

  const handleSave = () => {
  if (
    !editData.nomeEquipe.trim() ||
    !editData.nomeUsuario.trim() ||
    !editData.logo.trim()
  ) {
    toast({
      title: 'Campos obrigatórios',
      description: 'Preencha todos os campos para salvar!',
      variant: 'destructive'
    })

    return
  }

  console.log('Salvar dados:', editData)

  toast({
    title: 'Perfil Salvo',
    description: 'Seu perfil foi editado com sucesso!'
  })

  // futuramente integrar com backend

  setEditando(false)
}

  const handleCancel = () => {
    setEditando(false)

    setEditData({
      nomeEquipe: equipeFantasy?.nome ?? '',
      nomeUsuario: user.nome ?? '',
      logo: equipeFantasy?.logo ?? '',
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-display font-bold">
              Meu Perfil
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <Card>
          <CardContent className="flex items-start justify-between p-6">
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={editData.logo} />

                <AvatarFallback>
                  {editData.nomeEquipe?.charAt(0) ||
                    user.nome.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-3">
                {!editando ? (
                  <>
                    <h2 className="text-xl font-bold">
                      {editData.nomeEquipe}
                    </h2>

                    <p className="text-muted-foreground">
                      {editData.nomeUsuario}
                    </p>

                    <p className="text-muted-foreground">
                      {user.email}
                    </p>
                  </>
                ) : (
                  <div className="space-y-4 min-w-[320px]">
                    <div>
                      <Label className='text-md font-bold'>Nome da Minha Equipe</Label>

                      <Input
                        value={editData.nomeEquipe}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            nomeEquipe: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label className='text-md font-bold'>Nome de Usuário</Label>

                      <Input
                        value={editData.nomeUsuario}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            nomeUsuario: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label className='text-md font-bold'>Email</Label>

                      <Input
                        value={user.email}
                        disabled
                      />

                      <p className="text-xs text-muted-foreground mt-1">
                        O email só pode ser alterado na página de configurações.
                      </p>
                    </div>

                    <div>
                      <Label>Logo da Equipe Fantasy</Label>

                      <label className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer block mt-2">
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
                              const imageUrl =
                                URL.createObjectURL(file)

                              setEditData({
                                ...editData,
                                logo: imageUrl,
                              })
                            }
                          }}
                        />
                      </label>

                      {editData.logo && (
                        <img
                          src={editData.logo}
                          alt="Preview"
                          className="mt-4 h-24 w-24 object-cover rounded-lg border"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {!editando ? (
              <Button onClick={() => setEditando(true)}>
                <Pencil className="w-4 h-4 mr-2" />
                Editar
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>

                <Button
                  variant="outline"
                  onClick={handleCancel}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estatísticas</CardTitle>
          </CardHeader>

          <CardContent className="grid md:grid-cols-5 gap-4">
            <div className="p-4 bg-muted rounded">
              <p className="text-sm text-muted-foreground mb-2">
                Minha melhor liga
              </p>

              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={melhorLiga.logo} />

                  <AvatarFallback>
                    {melhorLiga.nome.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-medium">
                    {melhorLiga.nome}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    🏆 #{melhorLiga.posicao}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted rounded text-center">
              <p className="text-sm text-muted-foreground">
                Pontos
              </p>

              <p className="text-2xl font-bold text-primary">
                {pontosTotais}
              </p>
            </div>

            <div className="p-4 bg-muted rounded text-center">
              <p className="text-sm text-muted-foreground">
                Melhor posição
              </p>

              <p className="text-2xl font-bold">
                #{melhorLiga.posicao || '-'}
              </p>
            </div>

            <div className="p-4 bg-muted rounded text-center">
              <p className="text-sm text-muted-foreground">
                Ligas
              </p>

              <p className="text-2xl font-bold">
                {ligasCount}
              </p>
            </div>

            <div className="p-4 bg-muted rounded text-center">
              <p className="text-sm text-muted-foreground">
                Títulos
              </p>

              <p className="text-2xl font-bold text-yellow-400 flex items-center justify-center gap-1">
                {equipeFantasy?.titulos ?? 0} 🏆
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}