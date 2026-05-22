'use client'

import React from 'react'
import { Sidebar } from '@/components/playscore/sidebar'
import { DashboardHeader } from '@/components/playscore/dashboard-header'
import { cn } from '@/lib/utils'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sidebarCollapsed = false

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className={cn(
        'transition-all duration-300',
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      )}>
        <DashboardHeader userName="Usuario" />
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}