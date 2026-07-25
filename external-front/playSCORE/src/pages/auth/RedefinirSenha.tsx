'use client'

import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function RedefinirSenha() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const token = searchParams.get('token')

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setError('')

    if (!token) {
      setError('Token inválido ou expirado')
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    setLoading(true)

    try {
      // 🔥 FUTURO: chamar API
      await new Promise(res => setTimeout(res, 1500))

      setSuccess(true)

      // opcional: redirecionar depois de alguns segundos
      setTimeout(() => {
        navigate('/login')
      }, 2000)

    } catch (err) {
      setError('Erro ao redefinir senha')
    }

    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Redefinir senha</CardTitle>
          <CardDescription>
            Digite sua nova senha
          </CardDescription>
        </CardHeader>

        <CardContent>
          {success ? (
            <p className="text-green-500 text-sm">
              ✅ Senha redefinida com sucesso! Redirecionando...
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              <Input
                type="password"
                placeholder="Nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Input
                type="password"
                placeholder="Confirmar senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <Button className="w-full" disabled={loading}>
                {loading ? 'Salvando...' : 'Redefinir senha'}
              </Button>

            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}