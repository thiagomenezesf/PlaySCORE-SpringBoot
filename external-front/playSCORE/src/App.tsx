import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/hooks/use-auth'
import HomePage from '@/pages/Home'
import DashboardLayout from '@/layouts/DashboardLayout'
import Dashboard from '@/pages/dashboard/Dashboard'
import Ligas from '@/pages/dashboard/ligas/Ligas'
import LigaDetalhe from '@/pages/dashboard/ligas/LigaDetalhe'
import GerenciarLiga from '@/pages/dashboard/ligas/GerenciarLiga'
import CriarLiga from '@/pages/dashboard/ligas/CriarLiga'
import CriarCampeonato from '@/pages/dashboard/campeonatos/CriarCampeonato'
import GerenciarCampeonato from '@/pages/dashboard/campeonatos/GerenciarCampeonato'
import CampeonatoDetalhe from '@/pages/dashboard/campeonatos/CampeonatoDetalhe'
import Escalacao from '@/pages/dashboard/escalacao/Escalacao'
import Campeonatos from '@/pages/dashboard/campeonatos/Campeonatos'
import Login from '@/pages/auth/Login'
import Cadastro from '@/pages/auth/Cadastro'
import EsqueciSenha from './pages/auth/EsqueciSenha'
import RedefinirSenha from './pages/auth/RedefinirSenha'
import Perfil from './pages/auth/Perfil'
import Configuracoes from './pages/auth/Configuracoes'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
            <Route path="/dashboard/escalacao/:ligaId" element={<DashboardLayout><Escalacao /></DashboardLayout>} />
            <Route path="/campeonatos" element={<DashboardLayout><Campeonatos /></DashboardLayout>} />
            <Route path="/campeonatos/criar" element={<DashboardLayout><CriarCampeonato /></DashboardLayout>} />
            <Route path="/campeonatos/:id" element={<DashboardLayout><CampeonatoDetalhe /></DashboardLayout>} />
            <Route path="/campeonatos/:id/gerenciar" element={<DashboardLayout><GerenciarCampeonato /></DashboardLayout>} />
            <Route path="/ligas" element={<DashboardLayout><Ligas /></DashboardLayout>} />
            <Route path="/ligas/criar" element={<DashboardLayout><CriarLiga /></DashboardLayout>} />
            <Route path="/ligas/:id" element={<DashboardLayout><LigaDetalhe /></DashboardLayout>} />
            <Route path="/ligas/:id/gerenciar" element={<DashboardLayout><GerenciarLiga /></DashboardLayout>} />
            <Route path="/recuperar-senha" element={<EsqueciSenha />} />
            <Route path="/redefinir-senha" element={<RedefinirSenha />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App