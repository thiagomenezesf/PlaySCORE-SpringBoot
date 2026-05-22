import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface RoundSummaryCardProps {
  title: string
  leagueName: string
  logo?: string | null
  roundScore: number
  totalScore: number
  position: number
}

export function RoundSummaryCard({
  title,
  leagueName,
  logo,
  roundScore,
  totalScore,
  position,
}: RoundSummaryCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          {logo && <img src={logo} alt={leagueName} className="w-4 h-4" />}
          {leagueName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Pontuação da Rodada</span>
          <span className="font-semibold">{roundScore.toFixed(1)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Pontuação Total</span>
          <span className="font-semibold">{totalScore.toFixed(1)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Colocação</span>
          <Badge variant="secondary">{position}º</Badge>
        </div>
      </CardContent>
    </Card>
  )
}