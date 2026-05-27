// ==========================================
// TIPOS DO PLAYSCORE - Baseado no modelo lógico
// ==========================================

// Usuário
export interface Usuario {
  id: number
  nome: string
  email: string
  senha?: string
  avatar?: string
  createdAt?: Date
  role?: string
  permissions?: string[]
}

export type TipoJogo =
  | 'CAMPO'
  | 'FUTSAL'
  | 'FUT7'

// Campeonato
export interface Campeonato {
  id: number
  nome: string
  logo?: string
  tipoJogo: TipoJogo
  idUsuario: number // FK para Usuario.id
  numeroDeJogadoresJogando?: number
  descricao?: string
  status?: 'ativo' | 'inativo' | 'finalizado'
  createdAt?: Date
}

// Liga
export interface Liga {
  id: number
  nome: string
  logo?: string
  idCampeonato: number // FK para Campeonato.id
  idUsuarioCriador: number // FK para Usuario.id
  codigoAcesso: string
  descricao?: string
  maxParticipantes?: number
  createdAt?: Date
}

// Clube
export interface Clube {
  id: number
  nome: string
  logo?: string
  idCampeonato: number // FK para Campeonato.id
  sigla?: string
}

// ==========================================
// TIPOS AUXILIARES
// ==========================================

export type PosicaoAtleta =
  | 'GOL'
  | 'ZAG'
  | 'LAT'
  | 'MEI'
  | 'ATA'
  | 'FIXO'
  | 'ALA'
  | 'PIVO'

export type StatusRodada =
  | 'ABERTO'
  | 'FECHADO'

export type AcaoPontuacao =
  | 'GOLS'
  | 'ASSISTENCIAS'
  | 'CARTOES_AMARELOS'
  | 'CARTOES_VERMELHOS'
  | 'FINALIZACOES'
  | 'IMPEDIMENTOS'
  | 'FALTAS_COMETIDAS'
  | 'FALTAS_RECEBIDAS'
  | 'CANETAS'
  | 'CHAPEUS'
  | 'DRIBLES_SIMPLES'

// Atleta
export interface Atleta {
  id: number
  nome: string
  foto?: string
  posicao: PosicaoAtleta
  precoInicial: number
  precoAtual?: number
  idClube: number // FK para Clube.id
  clube?: Clube
  pontuacao?: number
  mediaPontuacao?: number
}

// Equipe Fantasy
export interface EquipeFantasy {
  id: number
  nome: string
  logo?: string
  idUsuario: number // FK para Usuario.id
  patrimonio: number
  titulos: number
  pontuacaoTotal?: number
  formacaoAtual?: string
  atletas?: Atleta[]
}

// Rodada
export interface Rodada {
  id: number
  status: StatusRodada
  idCampeonato: number // FK para Campeonato.id
  numero: number
  dataInicio?: Date
  dataFim?: Date
}

// Desempenho do Atleta
export interface DesempenhoAtleta {
  id: number
  gols: number
  assistencias: number
  cartoesAmarelos: number
  cartoesVermelhos: number
  finalizacoes: number
  impedimentos: number
  faltasCometidas: number
  faltasRecebidas: number
  caneta: number
  chapeu: number
  driblesSimples: number
  idRodada: number // FK para Rodada.id
  idAtleta: number // FK para Atleta.id
  pontosCalculados: number
  valorAtualizado: number
}

// Regra de Pontuação da Liga
export interface RegraPontuacaoLiga {
  id: number
  acao: AcaoPontuacao
  valor: number
  idLiga: number // FK para Liga.id
}

// Escalação
export interface Escalacao {
  id: string // VARCHAR no banco
  idAtleta: number // FK para Atleta.id
  idRodada: number // FK para Rodada.id
  idEquipeFantasy: number // FK para EquipeFantasy.id
  idEquipeLiga: number // FK para EquipeLiga.id (identifica qual liga a equipe está escalando)
  isCapitao?: boolean
}

// Desempenho da Equipe Fantasy
export interface DesempenhoEquipeFantasy {
  id: number
  pontuacaoRodada: number
  idDesempenhoAtleta: number // FK para DesempenhoAtleta.id
  idRodada: number // FK para Rodada.id
  idLiga: number // FK para Liga.id
  idEquipeFantasy: number // FK para EquipeFantasy.id
}

// Equipe na Liga
export interface EquipeLiga {
  id: number
  idLiga: number // FK para Liga.id
  patrimonio: number
  idEquipeFantasy: number // FK para EquipeFantasy.id
}

export interface CampeonatoRodada {
  id: number
  idCampeonato: number // FK para Campeonato.id
  idRodada: number // FK para Rodada.id
}

// ==========================================
// TIPOS DE NAVEGAÇÃO E UI
// ==========================================

export interface NavItem {
  title: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string | number
  children?: NavItem[]
}

export interface BreadcrumbItem {
  title: string
  href?: string
}

// ==========================================
// TIPOS DE RESPOSTA DA API
// ==========================================

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ==========================================
// TIPOS DE FORMULÁRIO
// ==========================================

export interface LoginForm {
  email: string
  senha: string
}

export interface CadastroForm {
  nome: string
  email: string
  senha: string
  confirmarSenha: string
}

export interface CriarLigaForm {
  nome: string
  idCampeonato: number
  descricao?: string
  maxParticipantes?: number
}

export interface CriarCampeonatoForm {
  nome: string
  descricao?: string
  logo?: File
}

export interface CriarClubeForm {
  nome: string
  sigla: string
  logo?: File
}

export interface CriarAtletaForm {
  nome: string
  posicao: Atleta['posicao']
  precoInicial: number
  idClube: number
  foto?: File
}
