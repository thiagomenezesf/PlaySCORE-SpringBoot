'use client'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, ArrowLeft, Settings } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'

export default function Configuracoes() {
  const navigate = useNavigate()

    const { toast } = useToast()

  // 🔒 SENHA
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')

  // 📧 EMAIL
  const [email, setEmail] = useState('thiago@email.com')
  const [novoEmail, setNovoEmail] = useState('')

  // 🔥 ALTERAR SENHA
  const handleSenha = () => {

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
            toast({
              title: 'Campos obrigatórios',
              description: 'Preencha todos os campos para salvar!',
              variant: 'destructive'
            })

      return
    }

    if (novaSenha.length < 6) {
      toast({
              title: 'Regra de senha',
              description: 'A nova senha deve ter pelo menos 6 caracteres',
              variant: 'destructive'
            })
      
      return
    }

    if (novaSenha !== confirmarSenha) {
      toast({
              title: 'Regra de senha',
              description: 'As senhas não coincidem',
              variant: 'destructive'
            })

      return
    }

    // 🔥 FUTURO: API
    else {
      toast({
              title: 'Sucesso ao salvar',
              description: 'Você mudou sua senha com sucesso!',
            })
    }

    setSenhaAtual('')
    setNovaSenha('')
    setConfirmarSenha('')
  }

  // 🔥 ALTERAR EMAIL
  const handleEmail = () => {

    if (!novoEmail) {
      toast({
              title: 'Email vazio',
              description: 'Você precisa digitar um email para alterar!',
              variant: 'destructive'
            })

      return
    }

    if (novoEmail == email) {
      toast({
              title: 'Email igual',
              description: 'Você precisa digitar um email diferente para alterar!',
              variant: 'destructive'
            })

      return
    }

    else {
      toast({
              title: 'Sucesso ao alterar email',
              description: 'Email alterado com sucesso!',
            })
    }

    // 🔥 FUTURO: API
    setEmail(novoEmail)
    setNovoEmail('')
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      {/* HEADER COM VOLTAR */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-display font-bold">Configurações</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* 🔒 SEGURANÇA */}
      <Card>
        <CardHeader>
          <CardTitle>Segurança</CardTitle>
          <CardDescription>Altere sua senha</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">

          <Input
            type="password"
            placeholder="Senha atual"
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Nova senha"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Confirmar nova senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />

          

          <Button onClick={handleSenha}>
            <Save className="w-4 h-4 mr-2" />
            Alterar senha
          </Button>

        </CardContent>
      </Card>

      {/* 📧 CONTA */}
      <Card>
        <CardHeader>
          <CardTitle>Conta</CardTitle>
          <CardDescription>Altere seu email</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">

          <Input
            disabled
            value={email}
          />

          <Input
            placeholder="Novo email"
            value={novoEmail}
            onChange={(e) => setNovoEmail(e.target.value)}
          />

          <Button onClick={handleEmail}>
            <Save className="w-4 h-4 mr-2" />
            Alterar email
          </Button>

        </CardContent>
      </Card>

      </div>
    </div>
  )
}