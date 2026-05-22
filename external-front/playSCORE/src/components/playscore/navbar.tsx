'use client'

import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Bell, User } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Logo } from './logo'

interface NavbarProps {
  isAuthenticated?: boolean
  userName?: string
}

const publicLinks = [
  { href: '/', label: 'Início' },
  { href: '/#como-funciona', label: 'Como Funciona' },
  { href: '/#recursos', label: 'Recursos' },
]

const authLinks = [
  { href: '/dashboard', label: 'Home' },
  { href: '/ligas', label: 'Ligas' },
  { href: '/campeonatos', label: 'Campeonatos' },
]

export function Navbar({ isAuthenticated = false, userName }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { pathname, hash } = useLocation()
  const currentPath = `${pathname}${hash}`

  const links = isAuthenticated ? authLinks : publicLinks

  const handleLogoClick = () => {
    const isHome = pathname === '/'
    if (isHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleLinkClick = (href: string) => {
    if (href === '/' && pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        <div onClick={handleLogoClick} className="cursor-pointer">
          <Logo size="md" />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => handleLinkClick(link.href)}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                currentPath === link.href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold flex items-center justify-center text-primary-foreground">
                  3
                </span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                <span>{userName || 'Perfil'}</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Entrar</Link>
              </Button>
              <Button asChild>
                <Link to="/cadastro">Cadastrar</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container py-4 space-y-4">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'block py-2 text-sm font-medium transition-colors hover:text-primary',
                  currentPath === link.href ? 'text-primary' : 'text-muted-foreground'
                )}
                onClick={() => {
                  handleLinkClick(link.href)
                  setMobileMenuOpen(false)
                }}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Button variant="ghost" className="justify-start gap-2">
                    <Bell className="h-4 w-4" />
                    Notificações
                  </Button>
                  <Button variant="ghost" className="justify-start gap-2">
                    <User className="h-4 w-4" />
                    {userName || 'Perfil'}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild className="justify-start">
                    <Link to="/login">Entrar</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/cadastro">Cadastrar</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
