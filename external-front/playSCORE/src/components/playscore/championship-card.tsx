'use client'

import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, Eye, Settings, Shield } from 'lucide-react'
import type { Campeonato } from '@/types'

interface ChampionshipCardProps {
  campeonato: Campeonato & { 
    totalClubes?: number
    totalAtletas?: number
  }
  className?: string
  showActions?: boolean
  isOwner?: boolean
}

const statusLabels: Record<NonNullable<Campeonato['status']>, { label: string; color: string }> = {
  ativo: { label: 'Ativo', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  inativo: { label: 'Inativo', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
  finalizado: { label: 'Finalizado', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
}

export function ChampionshipCard({ 
  campeonato, 
  className, 
  showActions = true,
  isOwner = false 
}: ChampionshipCardProps) {
  const status = statusLabels[campeonato.status || 'ativo']

  return (
    <Card className={cn('overflow-hidden hover:shadow-lg transition-shadow', className)}>
      <CardContent className="p-0">
        {/* Header com cor de fundo */}
        <div className="relative h-24 bg-gradient-to-br from-accent/20 to-accent/5 p-4">
          <div className="absolute inset-0 field-pattern opacity-30" />
          <div className="relative flex items-start justify-between">
            <div className="w-14 h-14 rounded-lg bg-background/80 backdrop-blur flex items-center justify-center">
              {campeonato.logo ? (
                <img src={campeonato.logo} alt={campeonato.nome} className="w-10 h-10 object-contain" />
              ) : (
                <Shield className="w-8 h-8 text-accent" />
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge variant="outline" className={cn('text-xs border', status.color)}>
                {status.label}
              </Badge>
              {isOwner && (
                <Badge variant="secondary" className="text-xs">
                  Criador
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg truncate">{campeonato.nome}</h3>
            {campeonato.descricao && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{campeonato.descricao}</p>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              <span>{campeonato.totalClubes || 0} clubes</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{campeonato.totalAtletas || 0} atletas</span>
            </div>
          </div>

          {showActions && (
            <div className="flex items-center gap-2 pt-2">
              <Button asChild variant="default" size="sm" className="flex-1">
                <Link to={`/campeonatos/${campeonato.id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Campeonato
                </Link>
              </Button>
              {isOwner && (
                <Button asChild variant="outline" size="sm">
                  <Link to={`/campeonatos/${campeonato.id}/gerenciar`}>
                    <Settings className="w-4 h-4" />
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
