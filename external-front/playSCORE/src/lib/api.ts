const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

async function request(path: string, options: RequestInit = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  // Campeonatos
  listCampeonatos: () => request('/campeonatos'),
  getCampeonato: (id: number) => request(`/campeonatos/${id}`),
  createCampeonato: (body: any) => request('/campeonatos', { method: 'POST', body: JSON.stringify(body) }),

  // Escalações
  listEscalacoes: () => request('/escalacoes'),
  createEscalacao: (body: any) => request('/escalacoes', { method: 'POST', body: JSON.stringify(body) }),

  // Rodada fechar
  fecharRodada: (id: number) => request(`/rodadas/${id}/fechar`, { method: 'POST' }),
  // Atletas / Clubes / Rodadas / Desempenhos / Ligas / Equipes
  listAtletas: () => request('/atletas'),
  listClubes: () => request('/clubes'),
  listUsuarios: () => request('/usuarios'),
  getUsuario: (id: number) => request(`/usuarios/${id}`),
  listRodadas: () => request('/rodadas'),
  listCampeonatoRodadas: () => request('/campeonato-rodadas'),
  listDesempenhoAtleta: () => request('/desempenho-atleta'),
  listDesempenhoEquipeFantasy: () => request('/desempenho-equipe-fantasy'),
  listRegraPontuacaoLiga: () => request('/regras-pontuacao-liga'),
  listEquipesFantasy: () => request('/equipe-fantasy'),
  listLigas: () => request('/ligas'),
  listEquipeLiga: () => request('/equipe-liga'),
};

export default api;
