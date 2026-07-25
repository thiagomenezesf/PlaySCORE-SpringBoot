'use client'

import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-24 bg-card/50">
      <div className="container">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-background border border-primary/20 p-8 md:p-12 lg:p-16">
          {/* Background Pattern */}
          <div className="absolute inset-0 field-pattern opacity-10" />
          
          {/* Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/30 rounded-full blur-[100px]" />
          
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Pronto para revolucionar seu{' '}
              <span className="text-primary">futebol amador</span>?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Junte-se a milhares de jogadores que ja estao transformando seus campeonatos 
              em experiencias incriveis com o PlaySCORE.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/cadastro">
                  Comecar Agora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link to="/login">
                  Ja tenho conta
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
