'use client'

import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, Eye, Settings, Trophy } from 'lucide-react'
import type { Liga } from '@/types'

interface LeagueCardProps {
  liga: Liga & { 
    participantes?: number
    campeonatoNome?: string 
  }
  className?: string
  showActions?: boolean
  isOwner?: boolean
  showJoinButton?: boolean
}

export function LeagueCard({ 
  liga, 
  className, 
  showActions = true,
  isOwner = false,
  showJoinButton = false
}: LeagueCardProps) {
  return (
    <Card className={cn('overflow-hidden hover:shadow-lg transition-shadow', className)}>
      <CardContent className="p-0">
        {/* Header com cor de fundo */}
        <div className="relative h-24 bg-gradient-to-br from-primary/20 to-primary/5 p-4">
          <div className="absolute inset-0 field-pattern opacity-30" />
          <div className="relative flex items-start justify-between">
            <div className="w-14 h-14 rounded-lg bg-background/80 backdrop-blur flex items-center justify-center">
              {liga.logo ? (
                <img src={liga.logo} alt={liga.nome} className="w-10 h-10 object-contain" />
              ) : (
                <Trophy className="w-8 h-8 text-primary" />
              )}
            </div>
            {isOwner && (
              <Badge variant="secondary" className="text-xs">
                Criador
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg truncate">{liga.nome}</h3>
            {liga.campeonatoNome && (
              <p className="text-sm text-muted-foreground truncate">{liga.campeonatoNome}</p>
            )}
          </div>

          {liga.descricao && (
            <p className="text-sm text-muted-foreground line-clamp-2">{liga.descricao}</p>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{liga.participantes || 0} participantes</span>
            </div>
          </div>

          {showActions && (
            <div className="flex items-center gap-2 pt-2">
              <Button asChild variant="default" size="sm" className="flex-1">
                <Link to={`/ligas/${liga.id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Liga
                </Link>
              </Button>
              {showJoinButton && !isOwner && (
                <Button asChild variant="outline" size="sm">
                  <Link to={`/ligas/${liga.id}`}>Entrar</Link>
                </Button>
              )}
              {isOwner && (
                <Button asChild variant="outline" size="sm">
                  <Link to={`/ligas/${liga.id}/gerenciar`}>
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
