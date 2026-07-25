'use client'

import { Card, CardContent } from '@/components/ui/card'
import { 
  Trophy, 
  Users, 
  Shield, 
  BarChart3, 
  Smartphone, 
  Zap 
} from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Crie Campeonatos',
    description: 'Monte seu próprio campeonato com times e atletas personalizados. Você tem controle total sobre as regras e participantes.',
  },
  {
    icon: Trophy,
    title: 'Ligas Personalizadas',
    description: 'Crie ligas privadas para disputar com amigos ou ligas abertas para competir com toda a comunidade.',
  },
  {
    icon: Users,
    title: 'Escale sua Equipe',
    description: 'Escolha os melhores jogadores, monte formações estratégicas e gerencie seu patrimônio como um verdadeiro técnico.',
  },
  {
    icon: BarChart3,
    title: 'Scouts Detalhados',
    description: 'Acompanhe gols, assistências, defesas e muito mais. Pontuações calculadas automaticamente após cada rodada.',
  },
  {
    icon: Smartphone,
    title: '100% Responsivo',
    description: 'Acesse de qualquer dispositivo. A experiência é otimizada para desktop, tablet e smartphone.',
  },
  {
    icon: Zap,
    title: 'Tempo Real',
    description: 'Atualizações instantâneas de pontuação. Veja sua classificação mudar enquanto os jogos acontecem.',
  },
]

export function FeaturesSection() {
  return (
    <section id="recursos" className="py-24 scroll-mt-24 bg-card/50">
      <div className="container">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Tudo que você precisa para{' '}
            <span className="text-primary">dominar o fantasy</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Recursos completos para criar, gerenciar e competir em campeonatos de futebol amador.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card 
                key={index} 
                className="group hover:shadow-lg hover:border-primary/50 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
