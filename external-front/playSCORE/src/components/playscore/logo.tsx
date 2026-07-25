'use client'

import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
  href?: string
}

export function Logo({ className, showText = true, size = 'md', href = '/' }: LogoProps) {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-lg' },
    md: { icon: 'w-10 h-10', text: 'text-xl' },
    lg: { icon: 'w-14 h-14', text: 'text-3xl' },
  }

  const content = (
    <div className={cn('flex items-center gap-2', className)}>

      {/* LOGO REAL (PNG embutido em SVG para fidelidade total) */}
      <div className={cn('relative', sizes[size].icon)}>
        <img
          src="/logoPlaySCORE.png"
          alt="PlayScore"
          className="w-full h-full object-contain"
        />
      </div>

      {showText && (
        <span className={cn('font-display font-bold tracking-tight', sizes[size].text)}>
          Play<span className="text-primary">SCORE</span>
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link to={href} className="hover:opacity-90 transition-opacity">
        {content}
      </Link>
    )
  }

  return content
}