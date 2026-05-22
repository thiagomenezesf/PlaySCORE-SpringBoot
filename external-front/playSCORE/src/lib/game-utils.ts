import type { DesempenhoAtleta, DesempenhoEquipeFantasy } from '@/types'

export function calcularPontosAtleta(
  atletaId: number,
  rodadaId: number | null,
  desempenhos: DesempenhoAtleta[]
) {
  if (!rodadaId) {
    return 0
  }

  const desempenho = desempenhos.find(
    (d) => d.idAtleta === atletaId && d.idRodada === rodadaId
  )

  return desempenho?.pontosCalculados ?? 0
}

export function calcularPontuacaoEquipe(
  idEquipeFantasy: number,
  idLiga: number,
  desempenhoEquipe: DesempenhoEquipeFantasy[],
  rodadaId?: number
) {
  return desempenhoEquipe
    .filter((d) => d.idEquipeFantasy === idEquipeFantasy && d.idLiga === idLiga)
    .filter((d) => (rodadaId ? d.idRodada === rodadaId : true))
    .reduce((acc, cur) => acc + cur.pontuacaoRodada, 0)
}

export function calcularValorAtualizado(
  precoInicial: number,
  desempenho?: DesempenhoAtleta
) {
  if (!desempenho) {
    return precoInicial
  }

  const ajustePorPontos = (desempenho.pontosCalculados - 8) * 0.03
  const ajustePorCartoes = desempenho.cartoesAmarelos * -0.02 + desempenho.cartoesVermelhos * -0.05
  const ajustePorDribles = desempenho.driblesSimples * 0.005
  const ajuste = Math.max(-0.25, Math.min(0.25, ajustePorPontos + ajustePorCartoes + ajustePorDribles))
  const valor = precoInicial * (1 + ajuste)

  return Number(valor.toFixed(2))
}
