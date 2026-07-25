const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

function normalizeCampeonato(c: any) {
  return { ...c, idUsuario: c.criador?.id ?? c.idUsuario };
}

function normalizeClube(c: any) {
  return {
    ...c,
    idCampeonato: Number(c.campeonato?.id ?? c.idCampeonato ?? 0),
    campeonato: c.campeonato ? { id: Number(c.campeonato.id), nome: c.campeonato.nome } : undefined,
  };
}

function normalizeAtleta(a: any) {
  return {
    ...a,
    idClube: Number(a.clube?.id ?? a.idClube ?? 0),
    clube: a.clube ? { id: Number(a.clube.id), nome: a.clube.nome } : undefined,
  };
}

function normalizeLiga(l: any) {
  return {
    ...l,
    idCampeonato: Number(l.campeonato?.id ?? l.idCampeonato ?? 0),
    idUsuarioCriador: l.criador?.id ?? l.idUsuarioCriador,
  };
}

function normalizeEquipeFantasy(e: any) {
  return {
    ...e,
    idUsuario: Number(e.criador?.id ?? e.idUsuario ?? 0),
  };
}

function normalizeEquipeLiga(e: any) {
  return {
    ...e,
    idLiga: Number(e.liga?.id ?? e.idLiga ?? 0),
    idEquipeFantasy: Number(e.equipeFantasy?.id ?? e.idEquipeFantasy ?? 0),
    patrimonio: Number(e.patrimonio ?? 0),
  };
}

function normalizeDesempenhoAtletaLiga(item: any) {
  const desempenhoAtleta = item.desempenhoAtleta || {}
  return {
    ...desempenhoAtleta,
    id: Number(item.id ?? 0),
    idAtleta: Number(desempenhoAtleta.id ?? item.idAtleta ?? 0),
    idRodada: Number(item.rodada?.id ?? item.idRodada ?? 0),
    pontosCalculados: Number(item.pontosCalculados ?? 0),
    valorAtual: Number(item.valorAtual ?? 0),
    valorAtualizado: Number(item.valorAtualizado ?? 0),
    rodada: item.rodada,
    liga: item.liga,
    desempenhoAtleta,
  };
}

function normalizeDesempenhoEquipeFantasy(item: any) {
  const equipeLiga = item.equipeLiga || {}
  return {
    ...item,
    idRodada: Number(item.rodada?.id ?? item.idRodada ?? 0),
    idEquipeLiga: Number(equipeLiga.id ?? item.idEquipeLiga ?? 0),
    idLiga: Number(equipeLiga.liga?.id ?? item.idLiga ?? 0),
    idEquipeFantasy: Number(equipeLiga.equipeFantasy?.id ?? item.idEquipeFantasy ?? 0),
    idDesempenhoAtleta: Number(item.desempenhoAtleta?.id ?? item.idDesempenhoAtleta ?? 0),
    pontuacaoRodada: Number(item.pontuacaoRodada ?? 0),
    equipeLiga,
    rodada: item.rodada,
  };
}

function normalizeEscalacao(e: any) {
  return {
    ...e,
    idAtleta: Number(e.atleta?.id ?? e.idAtleta ?? 0),
    idRodada: Number(e.rodada?.id ?? e.idRodada ?? 0),
    idEquipeLiga: Number(e.equipeLiga?.id ?? e.idEquipeLiga ?? 0),
    idEquipeFantasy: Number(e.equipeFantasy?.id ?? e.idEquipeFantasy ?? 0),
    isCapitao: e.isCapitao ?? false,
  };
}

async function request(path: string, options: RequestInit = {}) {
  const url = `${API_BASE}${path}`;
  const headers: HeadersInit = {};
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    headers,
    credentials: 'include',
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  if (res.status === 204) return null;
  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return null;
  }
  return res.json();
}

export const api = {
  uploadFile: (formData: FormData) => request('/upload', { method: 'POST', body: formData }),

  // Campeonatos
  listCampeonatos: async () => {
    const data = await request('/campeonatos');
    return Array.isArray(data) ? data.map(normalizeCampeonato) : [];
  },
  getCampeonato: async (id: number) => {
    const c = await request(`/campeonatos/${id}`);
    if (!c) return c;
    return normalizeCampeonato(c);
  },
  createCampeonato: (body: any) => request('/campeonatos', { method: 'POST', body: JSON.stringify(body) }),
  updateCampeonato: (id: number, body: any) => request(`/campeonatos/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCampeonato: (id: number) => request(`/campeonatos/${id}`, { method: 'DELETE' }),

  // Escalações
  listEscalacoes: async () => {
    const data = await request('/escalacoes');
    return Array.isArray(data) ? data.map(normalizeEscalacao) : [];
  },
  createEscalacao: (body: any) => request('/escalacoes', { method: 'POST', body: JSON.stringify(body) }),
  createEscalacaoBatch: (body: any) => request('/escalacoes/batch', { method: 'POST', body: JSON.stringify(body) }),

  // Rodada fechar
  fecharRodada: (id: number) => request(`/rodadas/${id}/fechar`, { method: 'POST' }),
  abrirRodada: (id: number) => request(`/rodadas/${id}/abrir`, { method: 'POST' }),
  // Atletas / Clubes / Rodadas / Desempenhos / Ligas / Equipes
  listAtletas: async () => {
    const data = await request('/atletas');
    return Array.isArray(data) ? data.map(normalizeAtleta) : [];
  },
  getAtleta: async (id: number) => normalizeAtleta(await request(`/atletas/${id}`)),
  createAtleta: async (body: any) => normalizeAtleta(await request('/atletas', { method: 'POST', body: JSON.stringify(body) })),
  updateAtleta: async (id: number, body: any) => normalizeAtleta(await request(`/atletas/${id}`, { method: 'PUT', body: JSON.stringify(body) })),
  deleteAtleta: (id: number) => request(`/atletas/${id}`, { method: 'DELETE' }),
  listClubes: async () => {
    const data = await request('/clubes');
    return Array.isArray(data) ? data.map(normalizeClube) : [];
  },
  getClube: async (id: number) => normalizeClube(await request(`/clubes/${id}`)),
  createClube: async (body: any) => normalizeClube(await request('/clubes', { method: 'POST', body: JSON.stringify(body) })),
  updateClube: async (id: number, body: any) => normalizeClube(await request(`/clubes/${id}`, { method: 'PUT', body: JSON.stringify(body) })),
  deleteClube: (id: number) => request(`/clubes/${id}`, { method: 'DELETE' }),
  listUsuarios: () => request('/usuarios'),
  getUsuario: (id: number) => request(`/usuarios/${id}`),
  loginUsuario: (body: any) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  registerUsuario: (body: any) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  updateUsuario: (id: number, body: any) => request(`/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  createUsuario: (body: any) => request('/usuarios', { method: 'POST', body: JSON.stringify(body) }),
  listRodadas: () => request('/rodadas'),
  listCampeonatoRodadas: () => request('/campeonato-rodadas'),
  getCampeonatoRodadaAtual: (idCampeonato: number) => request(`/campeonato-rodadas/campeonato/${idCampeonato}`),
  avancarCampeonatoRodada: (idCampeonato: number) => request(`/campeonato-rodadas/campeonato/${idCampeonato}/avancar`, { method: 'POST' }),
  listDesempenhoAtleta: () => request('/desempenho-atleta'),
  createDesempenhoAtleta: (body: any) => request('/desempenho-atleta', { method: 'POST', body: JSON.stringify(body) }),
  createDesempenhoAtletaBatch: (body: any) => request('/desempenho-atleta/batch', { method: 'POST', body: JSON.stringify(body) }),
  listDesempenhoAtletaLiga: async () => {
    const data = await request('/desempenho-atleta-liga');
    return Array.isArray(data) ? data.map(normalizeDesempenhoAtletaLiga) : [];
  },
  getDesempenhoAtletaLiga: (id: number) => request(`/desempenho-atleta-liga/${id}`),
  createDesempenhoAtletaLiga: (body: any) => request('/desempenho-atleta-liga', { method: 'POST', body: JSON.stringify(body) }),
  listDesempenhoEquipeFantasy: async () => {
    const data = await request('/desempenho-equipe-fantasy');
    return Array.isArray(data) ? data.map(normalizeDesempenhoEquipeFantasy) : [];
  },
  listRegraPontuacaoLiga: async () => {
    const data = await request('/regras-pontuacao-liga');
    return Array.isArray(data) ? data : [];
  },
  listEquipesFantasy: async () => {
    const data = await request('/equipe-fantasy');
    return Array.isArray(data) ? data.map(normalizeEquipeFantasy) : [];
  },
  getEquipeFantasy: async (id: number) => normalizeEquipeFantasy(await request(`/equipe-fantasy/${id}`)),
  updateEquipeFantasy: (id: number, body: any) => request(`/equipe-fantasy/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  createEquipeFantasy: async (body: any) => normalizeEquipeFantasy(await request('/equipe-fantasy', { method: 'POST', body: JSON.stringify(body) })),
  listLigas: async () => {
    const data = await request('/ligas');
    return Array.isArray(data) ? data.map(normalizeLiga) : [];
  },
  getLiga: async (id: number) => normalizeLiga(await request(`/ligas/${id}`)),
  createLiga: async (body: any) => normalizeLiga(await request('/ligas', { method: 'POST', body: JSON.stringify(body) })),
  updateLiga: async (id: number, body: any) => normalizeLiga(await request(`/ligas/${id}`, { method: 'PUT', body: JSON.stringify(body) })),
  deleteLiga: (id: number) => request(`/ligas/${id}`, { method: 'DELETE' }),
  listEquipeLiga: async () => {
    const data = await request('/equipe-liga');
    return Array.isArray(data) ? data.map(normalizeEquipeLiga) : [];
  },
  createEquipeLiga: async (body: any) => normalizeEquipeLiga(await request('/equipe-liga', { method: 'POST', body: JSON.stringify(body) })),
  createRegraPontuacaoLiga: (body: any) => request('/regras-pontuacao-liga', { method: 'POST', body: JSON.stringify(body) }),
  updateRegraPontuacaoLiga: (id: number, body: any) =>
    request(`/regras-pontuacao-liga/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  deleteRegraPontuacaoLiga: (id: number) =>
    request(`/regras-pontuacao-liga/${id}`, {
      method: 'DELETE'
    }),
};

export default api;
