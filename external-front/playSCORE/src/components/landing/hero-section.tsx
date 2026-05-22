'use client'

import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowRight, Trophy, Users, Shield } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 field-pattern opacity-20" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      
      {/* Accent Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px]" />

      <div className="container relative z-10 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
            <Trophy className="w-4 h-4" />
            <span>O Fantasy Game do Futebol Amador</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-balance">
            Transforme seu{' '}
            <span className="text-primary">campeonato amador</span>{' '}
            em uma experiência profissional
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Crie ligas, cadastre campeonatos, escale jogadores e dispute com seus amigos. 
            O PlaySCORE traz toda a emoção do fantasy game para o futebol da sua comunidade.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button asChild size="lg" className="text-lg px-8 h-14">
              <Link to="/cadastro">
                Criar Conta Grátis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 h-14">
              <Link to="/#como-funciona">
                Como Funciona
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-lg bg-primary/10">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl md:text-3xl font-bold">500+</p>
              <p className="text-sm text-muted-foreground">Ligas Criadas</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-lg bg-primary/10">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl md:text-3xl font-bold">10k+</p>
              <p className="text-sm text-muted-foreground">Jogadores</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-lg bg-primary/10">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl md:text-3xl font-bold">150+</p>
              <p className="text-sm text-muted-foreground">Campeonatos</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
