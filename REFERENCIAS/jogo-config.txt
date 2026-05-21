import type { Atleta, TipoJogo, AcaoPontuacao } from '@/types'

export type FormacaoTatica = {
  nome: string
  estrutura: Partial<Record<Atleta['posicao'], number>>
}

export const posicaoLabels: Record<Atleta['posicao'], string> = {
  GOL: 'Goleiro',
  ZAG: 'Zagueiro',
  LAT: 'Lateral',
  MEI: 'Meia',
  ATA: 'Atacante',
  FIXO: 'Fixo',
  ALA: 'Ala',
  PIVO: 'Pivô',
}

export const posicaoColors: Record<Atleta['posicao'], string> = {
  GOL: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  ZAG: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  LAT: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  MEI: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  ATA: 'bg-red-500/20 text-red-400 border-red-500/30',
  FIXO: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  ALA: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  PIVO: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
}

export const formacoes11v11: FormacaoTatica[] = [
  { nome: '3-4-3', estrutura: { GOL: 1, ZAG: 3, MEI: 4, ATA: 3 } },
  { nome: '3-5-2', estrutura: { GOL: 1, ZAG: 3, MEI: 5, ATA: 2 } },
  { nome: '4-3-3', estrutura: { GOL: 1, ZAG: 2, LAT: 2, MEI: 3, ATA: 3 } },
  { nome: '4-4-2', estrutura: { GOL: 1, ZAG: 2, LAT: 2, MEI: 4, ATA: 2 } },
  { nome: '5-2-3', estrutura: { GOL: 1, ZAG: 3, LAT: 2, MEI: 2, ATA: 3 } },
  { nome: '5-3-2', estrutura: { GOL: 1, ZAG: 3, LAT: 2, MEI: 3, ATA: 2 } },
  { nome: '5-4-1', estrutura: { GOL: 1, ZAG: 3, LAT: 2, MEI: 4, ATA: 1 } },
]

export const formacoes5v5: FormacaoTatica[] = [
  { nome: '1-2-1', estrutura: { GOL: 1, FIXO: 1, ALA: 2, PIVO: 1 } },
  { nome: '2-2 (2 alas e 2 pivôs)', estrutura: { GOL: 1, ALA: 2, PIVO: 2 } },
  { nome: '2-2 (2 fixos e 2 pivôs)', estrutura: { GOL: 1, FIXO: 2, PIVO: 2 } },
  { nome: '2-2 (2 fixos e 2 alas)', estrutura: { GOL: 1, FIXO: 2, ALA: 2 } },
]

export const formacoes7v7: FormacaoTatica[] = [
  { nome: '2-2-2', estrutura: { GOL: 1, ZAG: 2, MEI: 2, ATA: 2 } },
  { nome: '2-3-1', estrutura: { GOL: 1, ZAG: 2, MEI: 3, ATA: 1 } },
  { nome: '3-2-1', estrutura: { GOL: 1, ZAG: 3, MEI: 2, ATA: 1 } },
]

export const tiposJogo: Record<TipoJogo, { formacoes: FormacaoTatica[]; ordemCampo: Atleta['posicao'][] }> = {
  CAMPO: {
    formacoes: formacoes11v11,
    ordemCampo: ['ATA', 'MEI', 'LAT', 'ZAG', 'GOL'],
  },
  FUTSAL: {
    formacoes: formacoes5v5,
    ordemCampo: ['PIVO', 'ALA', 'FIXO', 'GOL'],
  },
  FUT7: {
    formacoes: formacoes7v7,
    ordemCampo: ['ATA', 'MEI', 'ZAG', 'GOL'],
  },
}

export type TipoJogoInfo = {
  label: string
  jogadores: number
}

export const tipoJogoInfos: Record<TipoJogo, TipoJogoInfo> = {
  CAMPO: { label: 'Campo', jogadores: 11 },
  FUTSAL: { label: 'Futsal', jogadores: 5 },
  FUT7: { label: 'Fut7', jogadores: 7 },
}

export const tipoJogoOptions = Object.entries(tipoJogoInfos).map(([value, info]) => ({
  value: value as TipoJogo,
  label: `${info.label} (${info.jogadores} jogadores)`,
  jogadores: info.jogadores,
}))

export const posicoesPorTipoJogo: Record<TipoJogo, Atleta['posicao'][]> = {
  CAMPO: ['GOL', 'ZAG', 'LAT', 'MEI', 'ATA'],
  FUTSAL: ['GOL', 'FIXO', 'ALA', 'PIVO'],
  FUT7: ['GOL', 'ZAG', 'MEI', 'ATA'],
}

type Coordenada = {
  x: number
  y: number
}

type LayoutFormacao = {
  [posicao: string]: Coordenada[]
}

/* =======================================================
   CAMPO
======================================================= */

export const layoutsCampo: Record<string, LayoutFormacao> = {

  '3-4-3': {
    ATA: [
      { x: 20, y: 14 },
      { x: 50, y: 10 },
      { x: 80, y: 14 }
    ],

    MEI: [
      { x: 15, y: 35 },
      { x: 38, y: 30 },
      { x: 62, y: 30 },
      { x: 85, y: 35 }
    ],

    ZAG: [
      { x: 25, y: 65 },
      { x: 50, y: 70 },
      { x: 75, y: 65 }
    ],

    GOL: [{ x: 50, y: 88 }]
  },

  '3-5-2': {
    ATA: [
      { x: 35, y: 15 },
      { x: 65, y: 15 }
    ],

    MEI: [
      { x: 10, y: 35 },
      { x: 30, y: 30 },
      { x: 50, y: 28 },
      { x: 70, y: 30 },
      { x: 90, y: 35 }
    ],

    ZAG: [
      { x: 25, y: 65 },
      { x: 50, y: 70 },
      { x: 75, y: 65 }
    ],

    GOL: [{ x: 50, y: 88 }]
  },

  '4-3-3': {
    ATA: [
      { x: 20, y: 15 },
      { x: 50, y: 10 },
      { x: 80, y: 15 }
    ],

    MEI: [
      { x: 25, y: 35 },
      { x: 50, y: 30 },
      { x: 75, y: 35 }
    ],

    LAT: [
      { x: 15, y: 60 },
      { x: 85, y: 60 }
    ],

    ZAG: [
      { x: 35, y: 65 },
      { x: 65, y: 65 }
    ],

    GOL: [{ x: 50, y: 88 }]
  },

  '4-4-2': {
    ATA: [
      { x: 35, y: 15 },
      { x: 65, y: 15 }
    ],

    MEI: [
      { x: 15, y: 35 },
      { x: 38, y: 30 },
      { x: 62, y: 30 },
      { x: 85, y: 35 }
    ],

    LAT: [
      { x: 15, y: 60 },
      { x: 85, y: 60 }
    ],

    ZAG: [
      { x: 35, y: 65 },
      { x: 65, y: 65 }
    ],

    GOL: [{ x: 50, y: 88 }]
  },

  '5-2-3': {
    ATA: [
      { x: 20, y: 15 },
      { x: 50, y: 10 },
      { x: 80, y: 15 }
    ],

    MEI: [
      { x: 35, y: 35 },
      { x: 65, y: 35 }
    ],

    LAT: [
      { x: 10, y: 55 },
      { x: 90, y: 55 }
    ],

    ZAG: [
      { x: 25, y: 68 },
      { x: 50, y: 72 },
      { x: 75, y: 68 }
    ],

    GOL: [{ x: 50, y: 88 }]
  },

  '5-3-2': {
    ATA: [
      { x: 35, y: 15 },
      { x: 65, y: 15 }
    ],

    MEI: [
      { x: 25, y: 35 },
      { x: 50, y: 30 },
      { x: 75, y: 35 }
    ],

    LAT: [
      { x: 10, y: 55 },
      { x: 90, y: 55 }
    ],

    ZAG: [
      { x: 25, y: 68 },
      { x: 50, y: 72 },
      { x: 75, y: 68 }
    ],

    GOL: [{ x: 50, y: 88 }]
  },

  '5-4-1': {
    ATA: [
      { x: 50, y: 12 }
    ],

    MEI: [
      { x: 15, y: 35 },
      { x: 38, y: 30 },
      { x: 62, y: 30 },
      { x: 85, y: 35 }
    ],

    LAT: [
      { x: 10, y: 55 },
      { x: 90, y: 55 }
    ],

    ZAG: [
      { x: 25, y: 68 },
      { x: 50, y: 72 },
      { x: 75, y: 68 }
    ],

    GOL: [{ x: 50, y: 88 }]
  }
}

/* =======================================================
   FUTSAL
======================================================= */

export const layoutsFutsal: Record<string, LayoutFormacao> = {

  '1-2-1': {
    PIVO: [{ x: 50, y: 15 }],

    ALA: [
      { x: 25, y: 40 },
      { x: 75, y: 40 }
    ],

    FIXO: [{ x: 50, y: 65 }],

    GOL: [{ x: 50, y: 85 }]
  },

  '2-2 (2 alas e 2 pivôs)': {
    PIVO: [
      { x: 35, y: 20 },
      { x: 65, y: 20 }
    ],

    ALA: [
      { x: 30, y: 55 },
      { x: 70, y: 55 }
    ],

    GOL: [{ x: 50, y: 85 }]
  },

  '2-2 (2 fixos e 2 pivôs)': {
    PIVO: [
      { x: 35, y: 20 },
      { x: 65, y: 20 }
    ],

    FIXO: [
      { x: 35, y: 60 },
      { x: 65, y: 60 }
    ],

    GOL: [{ x: 50, y: 85 }]
  },

  '2-2 (2 fixos e 2 alas)': {
    ALA: [
      { x: 35, y: 25 },
      { x: 65, y: 25 }
    ],

    FIXO: [
      { x: 35, y: 60 },
      { x: 65, y: 60 }
    ],

    GOL: [{ x: 50, y: 85 }]
  }
}

/* =======================================================
   FUT7
======================================================= */

export const layoutsFut7: Record<string, LayoutFormacao> = {

  '2-2-2': {
    ATA: [
      { x: 35, y: 18 },
      { x: 65, y: 18 }
    ],

    MEI: [
      { x: 35, y: 45 },
      { x: 65, y: 45 }
    ],

    ZAG: [
      { x: 35, y: 68 },
      { x: 65, y: 68 }
    ],

    GOL: [{ x: 50, y: 88 }]
  },

  '2-3-1': {
    ATA: [
      { x: 50, y: 15 }
    ],

    MEI: [
      { x: 20, y: 40 },
      { x: 50, y: 35 },
      { x: 80, y: 40 }
    ],

    ZAG: [
      { x: 35, y: 68 },
      { x: 65, y: 68 }
    ],

    GOL: [{ x: 50, y: 88 }]
  },

  '3-2-1': {
    ATA: [
      { x: 50, y: 15 }
    ],

    MEI: [
      { x: 35, y: 40 },
      { x: 65, y: 40 }
    ],

    ZAG: [
      { x: 20, y: 68 },
      { x: 50, y: 72 },
      { x: 80, y: 68 }
    ],

    GOL: [{ x: 50, y: 88 }]
  }
}

export const layoutsPorTipo = {
  CAMPO: layoutsCampo,
  FUTSAL: layoutsFutsal,
  FUT7: layoutsFut7
}

export const acoesPontuacao: Array<{
  id: AcaoPontuacao
  nome: string
  descricao: string
}> = [
  { id: 'GOLS', nome: 'Gol', descricao: 'Pontos por gol marcado' },
  { id: 'ASSISTENCIAS', nome: 'Assistência', descricao: 'Pontos por assistência' },
  { id: 'CARTOES_AMARELOS', nome: 'Cartão Amarelo', descricao: 'Pontos por cartão amarelo' },
  { id: 'CARTOES_VERMELHOS', nome: 'Cartão Vermelho', descricao: 'Pontos por cartão vermelho' },
  { id: 'FINALIZACOES', nome: 'Finalizações', descricao: 'Pontos por finalização' },
  { id: 'CANETAS', nome: 'Canetas', descricao: 'Pontos por caneta' },
  { id: 'CHAPEUS', nome: 'Chapéus', descricao: 'Pontos por chapéu' },
  { id: 'DRIBLES_SIMPLES', nome: 'Dribles', descricao: 'Pontos por drible' },
]