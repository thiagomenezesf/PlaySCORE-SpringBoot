/* ================= DADOS (mock ou API) ================= */
import api from '@/lib/api'

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'

// USUÁRIOS (padrão: mocks, serão sobrescritos pela API se disponível)
export let mockUsuarios = [
  {
    id: 1,
    nome: 'Thiago',
    email: 'thiago@gmail.com',
    senha: '123'
  },

  {
    id: 2,
    nome: 'João',
    email: 'joao@gmail.com',
    senha: '123'
  },

  {
    id: 3,
    nome: 'Maria',
    email: 'maria@gmail.com',
    senha: '123'
  }
]

//CAMPEONATOS
export let mockCampeonatos = [
  {
    id: 1,
    nome: 'Campeonato Várzea 2024',
    logo: 'https://a1.espncdn.com/combiner/i?img=%2Fi%2Fleaguelogos%2Fsoccer%2F500%2F23.png',
    tipoJogo: 'CAMPO',
    idUsuario: 1,
    descricao: 'Campeonato do bairro Primeiro de Maio'
  },

  {
    id: 2,
    nome: 'Copa Universitária',
    logo: undefined,
    tipoJogo: 'FUTSAL',
    idUsuario: 2,
    descricao: 'Campeonato universitario de São Joao'
  },

  {
    id: 3,
    nome: 'Society Open',
    logo: undefined,
    tipoJogo: 'FUT7',
    idUsuario: 3,
    descricao: 'Campeonato society do bairro Primeiro de Maio'
  }
]

//LIGAS
export let mockLigas = [
  {
    id: 1,
    nome: 'Liga dos Amigos',
    logo: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/2674.png',
    idCampeonato: 1,
    idUsuarioCriador: 1,
    codigoAcesso: 'ABC123',
    maxParticipantes: 10,
    descricao: 'Liga montada pelos amigos do IF'
  },

  {
    id: 2,
    nome: 'Liga Universitária',
    logo: undefined,
    idCampeonato: 2,
    idUsuarioCriador: 2,
    codigoAcesso: 'FUTSAL',
    maxParticipantes: 15,
    descricao: 'Torneio universitario das atléticas de São João'
  },

  {
    id: 3,
    nome: 'Liga Society',
    logo: undefined,
    idCampeonato: 3,
    idUsuarioCriador: 3,
    codigoAcesso: 'SOCIETY',
    maxParticipantes: 20,
    descricao: 'Torneio society das atléticas de São João'
  }
]

//CLUBES
export let mockClubes = [
  {
    id: 1,
    nome: 'Palmeirinha FC',
    logo: undefined,
    idCampeonato: 1
  },

  {
    id: 2,
    nome: 'Corinthians da Várzea',
    logo: undefined,
    idCampeonato: 1
  },

  {
    id: 3,
    nome: 'Atlética FSP',
    logo: undefined,
    idCampeonato: 2
  }
]

//ATLETAS
export let mockAtletas = [
  {
    id: 1,
    nome: 'Gabriel Nunes',
    foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGv0ZIrLidHrXmxdSY38qwW3_FyQZhJo-sFQ&s',
    posicao: 'GOL',
    precoInicial: 8.5,
    idClube: 1,
  },
  {
    id: 2,
    nome: 'Lucas Silva',
    foto: 'https://i.pravatar.cc/150?img=2',
    posicao: 'ATA',
    precoInicial: 12,
    idClube: 1,
  },
  {
    id: 3,
    nome: 'Rafael Costa',
    foto: 'https://i.pravatar.cc/150?img=3',
    posicao: 'MEI',
    precoInicial: 9,
    idClube: 2,
  },
  {
    id: 4,
    nome: 'Carlos Mendes',
    foto: 'https://i.pravatar.cc/150?img=4',
    posicao: 'ZAG',
    precoInicial: 7.0,
    idClube: 2,
  },
  {
    id: 5,
    nome: 'João Oliveira',
    foto: 'https://i.pravatar.cc/150?img=5',
    posicao: 'LAT',
    precoInicial: 6.0,
    idClube: 1,
  },
  {
    id: 6,
    nome: 'Thiago Pereira',
    foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGv0ZIrLidHrXmxdSY38qwW3_FyQZhJo-sFQ&s',
    posicao: 'PIVO',
    precoInicial: 10.0,
    idClube: 3,
  },
  {
    id: 7,
    nome: 'Felipe Gomes',
    foto: 'https://i.pravatar.cc/150?img=7',
    posicao: 'ATA',
    precoInicial: 11.5,
    idClube: 1,
  },
  {
    id: 8,
    nome: 'Murilo Santos',
    foto: 'https://i.pravatar.cc/150?img=8',
    posicao: 'ZAG',
    precoInicial: 7.5,
    idClube: 2,
  },
  {
    id: 9,
    nome: 'Gustavo Alves',
    foto: 'https://i.pravatar.cc/150?img=9',
    posicao: 'LAT',
    precoInicial: 6.5,
    idClube: 2,
  },
  {
    id: 10,
    nome: 'Diego Ferreira',
    foto: 'https://i.pravatar.cc/150?img=10',
    posicao: 'MEI',
    precoInicial: 9.5,
    idClube: 1,
  },
  {
    id: 11,
    nome: 'Henrique Lima',
    foto: 'https://i.pravatar.cc/150?img=11',
    posicao: 'ALA',
    precoInicial: 13.0,
    idClube: 3,
  },
  {
    id: 12,
    nome: 'Bruno Costa',
    foto: 'https://i.pravatar.cc/150?img=12',
    posicao: 'GOL',
    precoInicial: 8.0,
    idClube: 2,
  },
  {
    id: 13,
    nome: 'Pedro Marques',
    foto: 'https://i.pravatar.cc/150?img=13',
    posicao: 'ZAG',
    precoInicial: 7.2,
    idClube: 1,
  },
  {
    id: 14,
    nome: 'Leandro Ribeiro',
    foto: 'https://i.pravatar.cc/150?img=14',
    posicao: 'ALA',
    precoInicial: 6.3,
    idClube: 3,
  },
  {
    id: 15,
    nome: 'Rodolfo Barbosa',
    foto: 'https://i.pravatar.cc/150?img=15',
    posicao: 'MEI',
    precoInicial: 9.8,
    idClube: 2,
  },
  {
    id: 16,
    nome: 'André Souza',
    foto: 'https://i.pravatar.cc/150?img=16',
    posicao: 'ATA',
    precoInicial: 12.5,
    idClube: 1,
  },
  {
    id: 17,
    nome: 'Fabio Mendes',
    foto: 'https://i.pravatar.cc/150?img=17',
    posicao: 'MEI',
    precoInicial: 9.0,
    idClube: 1,
  },
  {
    id: 18,
    nome: 'Felipe Melo',
    foto: 'https://i.pravatar.cc/150?img=18',
    posicao: 'MEI',
    precoInicial: 9.0,
    idClube: 1,
  },
  {
    id: 19,
    nome: 'Rogerio Cips',
    foto: 'https://i.pravatar.cc/150?img=19',
    posicao: 'MEI',
    precoInicial: 9.0,
    idClube: 1,
  },
  {
    id: 20,
    nome: 'Diego Santos',
    foto: 'https://i.pravatar.cc/150?img=20',
    posicao: 'FIXO',
    precoInicial: 10.0,
    idClube: 3,
  },
  {
    id: 21,
    nome: 'Leo Lima',
    foto: 'https://i.pravatar.cc/150?img=21',
    posicao: 'ATA',
    precoInicial: 11.0,
    idClube: 2,
  },
  {
    id: 22,
    nome: 'Bruno Geison',
    foto: 'https://i.pravatar.cc/150?img=22',
    posicao: 'ATA',
    precoInicial: 11.0,
    idClube: 2,
  },
  {
    id: 23,
    nome: 'Meia Geison',
    foto: 'https://i.pravatar.cc/150?img=23',
    posicao: 'MEI',
    precoInicial: 11.0,
    idClube: 2,
  },
  {
    id: 24,
    nome: 'Vitor Santos',
    foto: 'https://i.pravatar.cc/150?img=24',
    posicao: 'ALA',
    precoInicial: 6.8,
    idClube: 3,
  }
]

//RODADAS
export let mockRodadas = [
  {
    id: 1,
    status: 'ABERTO',
    idCampeonato: 1,
    numero: 1
  },

  {
    id: 2,
    status: 'FECHADO',
    idCampeonato: 1,
    numero: 2
  },

  {
    id: 3,
    status: 'ABERTO',
    idCampeonato: 2,
    numero: 1
  }
]

// Relaciona campeonato com a rodada atual do campeonato
export let mockCampeonatoRodadas = [
  {
    id: 1,
    idCampeonato: 1,
    idRodada: 1
  },
  {
    id: 2,
    idCampeonato: 2,
    idRodada: 3
  }
]

//EQUIPES FANTASY
export let mockEquipesFantasy = [
  {
    id: 1,
    nome: 'Time do Thiago',
    logo: 'https://s2-oglobo.glbimg.com/x4Y1G1MqbENX9R4PFvZmmI_wwTY=/0x0:613x631/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_da025474c0c44edd99332dddb09cabe8/internal_photos/bs/2026/r/D/x6aVyoRTiBXocaO5yhiw/screenshot-162.png',
    idUsuario: 1,
    titulos: 1
  },

  {
    id: 2,
    nome: 'Os Craques',
    logo: undefined,
    idUsuario: 2,
    titulos: 0
  },

  {
    id: 3,
    nome: 'Equipe Maria',
    logo: undefined,
    idUsuario: 3,
    titulos: 0
  }
]

//DESEMPENHO_ATLETA
export let mockDesempenhoAtleta = [
  {
    id: 1,
    gols: 2,
    assistencias: 1,
    cartoesAmarelos: 0,
    cartoesVermelhos: 0,
    finalizacoes: 5,
    impedimentos: 0,
    faltasCometidas: 2,
    faltasRecebidas: 3,
    caneta: 1,
    chapeu: 0,
    driblesSimples: 4,
    idRodada: 1,
    idAtleta: 1,
    pontosCalculados: 15.5,
    valorAtualizado: 9.0
  },

  {
    id: 2,
    gols: 1,
    assistencias: 2,
    cartoesAmarelos: 1,
    cartoesVermelhos: 0,
    finalizacoes: 3,
    impedimentos: 1,
    faltasCometidas: 1,
    faltasRecebidas: 2,
    caneta: 0,
    chapeu: 1,
    driblesSimples: 6,
    idRodada: 1,
    idAtleta: 2,
    pontosCalculados: 12.0,
    valorAtualizado: 13.0
  },

  {
    id: 3,
    gols: 0,
    assistencias: 3,
    cartoesAmarelos: 0,
    cartoesVermelhos: 0,
    finalizacoes: 2,
    impedimentos: 0,
    faltasCometidas: 0,
    faltasRecebidas: 1,
    caneta: 0,
    chapeu: 0,
    driblesSimples: 3,
    idRodada: 2,
    idAtleta: 3,
    pontosCalculados: 8.5,
    valorAtualizado: 9.5
  },

  {
    id: 4,
    gols: 12,
    assistencias: 3,
    cartoesAmarelos: 0,
    cartoesVermelhos: 0,
    finalizacoes: 5,
    impedimentos: 0,
    faltasCometidas: 2,
    faltasRecebidas: 3,
    caneta: 1,
    chapeu: 0,
    driblesSimples: 4,
    idRodada: 2,
    idAtleta: 1,
    pontosCalculados: 15.5,
    valorAtualizado: 9.0
  },
]

//REGRA_PONTUACAO_LIGA
export let mockRegraPontuacaoLiga = [
  {
    id: 1,
    acao: 'GOLS',
    valor: 5.0,
    idLiga: 1
  },

  {
    id: 2,
    acao: 'ASSISTENCIAS',
    valor: 3.0,
    idLiga: 1
  },

  {
    id: 3,
    acao: 'CARTOES_AMARELOS',
    valor: -1.0,
    idLiga: 1
  },

  {
    id: 4,
    acao: 'CARTOES_VERMELHOS',
    valor: -3.0,
    idLiga: 1
  },

  {
    id: 5,
    acao: 'FINALIZACOES',
    valor: 0.5,
    idLiga: 2
  },

  {
    id: 6,
    acao: 'CANETAS',
    valor: 2.0,
    idLiga: 2
  },

  {
    id: 7,
    acao: 'CHAPEUS',
    valor: 4.0,
    idLiga: 3
  },

  {
    id: 8,
    acao: 'DRIBLES_SIMPLES',
    valor: 1.0,
    idLiga: 3
  }
]

//ESCALACAO
export let mockEscalacao = [
  {
    id: 'esc1',
    idAtleta: 1,
    idRodada: 1,
    idEquipeFantasy: 1,
    idEquipeLiga: 1,
    isCapitao: true
  },

  {
    id: 'esc2',
    idAtleta: 2,
    idRodada: 1,
    idEquipeFantasy: 1,
    idEquipeLiga: 1
  },

  {
    id: 'esc3',
    idAtleta: 3,
    idRodada: 2,
    idEquipeFantasy: 2,
    idEquipeLiga: 2
  },

  {
    id: 'esc4',
    idAtleta: 1,
    idRodada: 3,
    idEquipeFantasy: 3,
    idEquipeLiga: 3
  },

  {
    id: 'esc5',
    idAtleta: 2,
    idRodada: 3,
    idEquipeFantasy: 3,
    idEquipeLiga: 3
  },

  {
    id: 'esc6',
    idAtleta: 10,
    idRodada: 1,
    idEquipeFantasy: 1,
    idEquipeLiga: 1,
    isCapitao: true
  },
]

//DESEMPENHO_EQUIPE_FANTASY
export let mockDesempenhoEquipeFantasy = [
  {
    id: 1,
    pontuacaoRodada: 5.5,
    idDesempenhoAtleta: 1,
    idRodada: 1,
    idLiga: 1,
    idEquipeFantasy: 1
  },

  {
    id: 2,
    pontuacaoRodada: 12.0,
    idDesempenhoAtleta: 2,
    idRodada: 2,
    idLiga: 1,
    idEquipeFantasy: 1
  },

  {
    id: 3,
    pontuacaoRodada: 8.5,
    idDesempenhoAtleta: 3,
    idRodada: 2,
    idLiga: 1,
    idEquipeFantasy: 2
  },

  {
    id: 4,
    pontuacaoRodada: 15.5,
    idDesempenhoAtleta: 1,
    idRodada: 1,
    idLiga: 1,
    idEquipeFantasy: 2
  }
]

//EQUIPE_LIGA
export let mockEquipeLiga = [
  {
    id: 1,
    idLiga: 1,
    patrimonio: 120.0,
    pontuacaoTotal: 25.5,
    idEquipeFantasy: 1
  },

  {
    id: 2,
    idLiga: 2,
    patrimonio: 100.0,
    pontuacaoTotal: 15.5,
    idEquipeFantasy: 2
  },

  {
    id: 3,
    idLiga: 3,
    patrimonio: 110.0,
    pontuacaoTotal: 0,
    idEquipeFantasy: 3
  },

  {
    id: 4,
    idLiga: 1,
    patrimonio: 95.0,
    pontuacaoTotal: 80.5,
    idEquipeFantasy: 2
  }
]

// Se não usar mocks, tenta carregar dados da API e sobrescrever as variáveis.
if (!useMocks) {
  ;(async () => {
    try {
      const [usuarios, campeonatos, ligas, clubes, atletas, rodadas, campeonatoRodadas, equipesFantasy, desempenhoAtleta, desempenhoEquipeFantasy, regras, equipeLiga] = await Promise.all([
        api.listUsuarios().catch(() => null),
        api.listCampeonatos().catch(() => null),
        api.listLigas().catch(() => null),
        api.listClubes().catch(() => null),
        api.listAtletas().catch(() => null),
        api.listRodadas().catch(() => null),
        api.listCampeonatoRodadas().catch(() => null),
        api.listEquipesFantasy().catch(() => null),
        api.listDesempenhoAtleta().catch(() => null),
        api.listDesempenhoEquipeFantasy().catch(() => null),
        api.listRegraPontuacaoLiga ? api.listRegraPontuacaoLiga().catch(() => null) : Promise.resolve(null),
        api.listEquipeLiga().catch(() => null)
      ])

      if (usuarios && Array.isArray(usuarios)) mockUsuarios = usuarios
      if (campeonatos && Array.isArray(campeonatos)) mockCampeonatos = campeonatos
      if (ligas && Array.isArray(ligas)) mockLigas = ligas
      if (clubes && Array.isArray(clubes)) mockClubes = clubes
      if (atletas && Array.isArray(atletas)) mockAtletas = atletas
      if (rodadas && Array.isArray(rodadas)) mockRodadas = rodadas
      if (campeonatoRodadas && Array.isArray(campeonatoRodadas)) mockCampeonatoRodadas = campeonatoRodadas
      if (equipesFantasy && Array.isArray(equipesFantasy)) mockEquipesFantasy = equipesFantasy
      if (desempenhoAtleta && Array.isArray(desempenhoAtleta)) mockDesempenhoAtleta = desempenhoAtleta
      if (desempenhoEquipeFantasy && Array.isArray(desempenhoEquipeFantasy)) mockDesempenhoEquipeFantasy = desempenhoEquipeFantasy
      if (regras && Array.isArray(regras)) mockRegraPontuacaoLiga = regras
      if (equipeLiga && Array.isArray(equipeLiga)) mockEquipeLiga = equipeLiga
    } catch (e) {
      // swallow, manterá os dados de mock
      console.warn('Não foi possível carregar dados da API, usando mocks locais', e)
    }
  })()
}

