'use client'

import { cn } from '@/lib/utils'

const steps = [
  {
    number: '01',
    title: 'Crie sua conta',
    description: 'Cadastre-se gratuitamente em poucos segundos e tenha acesso a todas as funcionalidades da plataforma.',
  },
  {
    number: '02',
    title: 'Entre ou crie uma liga',
    description: 'Procure por ligas existentes usando o codigo de acesso ou crie sua propria liga para competir com amigos.',
  },
  {
    number: '03',
    title: 'Monte seu time',
    description: 'Escolha os melhores atletas do campeonato respeitando o limite de patrimonio. Defina sua formacao e capitao.',
  },
  {
    number: '04',
    title: 'Acompanhe e venca',
    description: 'Apos as rodadas, os scouts sao atualizados e sua pontuacao e calculada. Suba no ranking e conquiste o titulo!',
  },
]

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-24 scroll-mt-24">
      <div className="container">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Como funciona o{' '}
            <span className="text-primary">PlaySCORE</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Em apenas 4 passos voce esta pronto para competir.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-border hidden md:block" />
            
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className="relative flex items-start gap-6 md:gap-8"
                >
                  {/* Number */}
                  <div className={cn(
                    'relative z-10 flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-xl font-display font-bold',
                    'bg-primary text-primary-foreground'
                  )}>
                    {step.number}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-3">
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
