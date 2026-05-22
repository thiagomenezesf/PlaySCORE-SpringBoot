'use client'

import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Home, 
  Trophy, 
  Plus, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  UserCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Logo } from './logo'
import { useAuth } from '@/hooks/use-auth'
import { useState } from 'react'

interface SidebarProps {
  className?: string
}

const menuItems = [
  {
    title: 'Menu Principal',
    items: [
      { href: '/dashboard', label: 'Home', icon: Home },
      { href: '/ligas', label: 'Ligas', icon: Trophy },
      { href: '/campeonatos', label: 'Campeonatos', icon: Shield },
    ],
  },
  {
    title: 'Criar',
    items: [
      { href: '/ligas/criar', label: 'Nova Liga', icon: Plus },
      { href: '/campeonatos/criar', label: 'Novo Campeonato', icon: Plus },
    ],
  },
  {
    title: 'Conta',
    items: [
      { href: '/perfil', label: 'Perfil', icon: UserCircle },
      { href: '/configuracoes', label: 'Configurações', icon: Settings },
    ],
  },
]

export function Sidebar({ className }: SidebarProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className={cn(
          'flex items-center h-16 px-4 border-b border-sidebar-border',
          collapsed ? 'justify-center' : 'justify-between'
        )}>
          <Logo size="sm" showText={!collapsed} />
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-8 w-8', collapsed && 'hidden')}
            onClick={() => setCollapsed(true)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-6">
              {!collapsed && (
                <h3 className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {group.title}
                </h3>
              )}
              <ul className="space-y-1 px-2">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                  const Icon = item.icon

                  return (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                          collapsed && 'justify-center'
                        )}
                        title={collapsed ? item.label : undefined}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        {!collapsed && <span>{item.label}</span>}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          {collapsed ? (
            <div className="flex flex-col gap-2 items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCollapsed(false)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-destructive hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </Button>
          )}
        </div>
      </div>
    </aside>
  )
}
