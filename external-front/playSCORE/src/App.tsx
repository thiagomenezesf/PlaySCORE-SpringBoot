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
import ProtectedRoute from '@/components/auth/ProtectedRoute'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/escalacao/:ligaId" element={<ProtectedRoute><DashboardLayout><Escalacao /></DashboardLayout></ProtectedRoute>} />
            <Route path="/campeonatos" element={<ProtectedRoute><DashboardLayout><Campeonatos /></DashboardLayout></ProtectedRoute>} />
            <Route path="/campeonatos/criar" element={<ProtectedRoute><DashboardLayout><CriarCampeonato /></DashboardLayout></ProtectedRoute>} />
            <Route path="/campeonatos/:id" element={<ProtectedRoute><DashboardLayout><CampeonatoDetalhe /></DashboardLayout></ProtectedRoute>} />
            <Route path="/campeonatos/:id/gerenciar" element={<ProtectedRoute><DashboardLayout><GerenciarCampeonato /></DashboardLayout></ProtectedRoute>} />
            <Route path="/ligas" element={<ProtectedRoute><DashboardLayout><Ligas /></DashboardLayout></ProtectedRoute>} />
            <Route path="/ligas/criar" element={<ProtectedRoute><DashboardLayout><CriarLiga /></DashboardLayout></ProtectedRoute>} />
            <Route path="/ligas/:id" element={<ProtectedRoute><DashboardLayout><LigaDetalhe /></DashboardLayout></ProtectedRoute>} />
            <Route path="/ligas/:id/gerenciar" element={<ProtectedRoute><DashboardLayout><GerenciarLiga /></DashboardLayout></ProtectedRoute>} />
            <Route path="/recuperar-senha" element={<EsqueciSenha />} />
            <Route path="/redefinir-senha" element={<RedefinirSenha />} />
            <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
            <Route path="/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App