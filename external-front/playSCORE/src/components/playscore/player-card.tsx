'use client'

import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Atleta } from '@/types'
import { User } from 'lucide-react'

interface PlayerCardProps {
  atleta: Atleta
  className?: string
  onClick?: () => void
  selected?: boolean
  showPrice?: boolean
  showStats?: boolean
}

const posicaoColors: Record<Atleta['posicao'], string> = {
  GOL: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  ZAG: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  LAT: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  MEI: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  ATA: 'bg-red-500/20 text-red-400 border-red-500/30',
  FIXO: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  ALA: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  PIVO: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
}

const posicaoLabels: Record<Atleta['posicao'], string> = {
  GOL: 'Goleiro',
  ZAG: 'Zagueiro',
  LAT: 'Lateral',
  MEI: 'Meia',
  ATA: 'Atacante',
  FIXO: 'Fixo',
  ALA: 'Ala',
  PIVO: 'Pivô',
}

export function PlayerCard({ 
  atleta, 
  className, 
  onClick, 
  selected = false,
  showPrice = true,
  showStats = false,
}: PlayerCardProps) {
  return (
    <Card
      className={cn(
        'relative overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg',
        selected && 'ring-2 ring-primary',
        className
      )}
      onClick={onClick}
    >
      <div className="p-4">
        {/* Foto do Atleta */}
        <div className="relative w-full aspect-square mb-3 rounded-lg bg-muted overflow-hidden">
          {atleta.foto ? (
            <img
              src={atleta.foto}
              alt={atleta.nome}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
          {/* Badge de posição */}
          <Badge 
            className={cn(
              'absolute top-2 right-2 border',
              posicaoColors[atleta.posicao]
            )}
          >
            {atleta.posicao}
          </Badge>
        </div>

        {/* Info do Atleta */}
        <div className="space-y-1">
          <h4 className="font-semibold text-sm truncate">{atleta.nome}</h4>
          {atleta.clube && (
            <p className="text-xs text-muted-foreground truncate">{atleta.clube.nome}</p>
          )}
          <p className="text-xs text-muted-foreground">{posicaoLabels[atleta.posicao]}</p>
        </div>

        {/* Preço */}
        {showPrice && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Preço</span>
              <span className="font-bold text-primary">
                C$ {(atleta.precoAtual || atleta.precoInicial).toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Estatísticas */}
        {showStats && atleta.pontuacao !== undefined && (
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Pontuação</span>
            <span className={cn(
              'font-bold',
              atleta.pontuacao > 0 ? 'text-emerald-400' : atleta.pontuacao < 0 ? 'text-red-400' : 'text-muted-foreground'
            )}>
              {atleta.pontuacao > 0 && '+'}{atleta.pontuacao.toFixed(1)}
            </span>
          </div>
        )}
      </div>
    </Card>
  )
}
