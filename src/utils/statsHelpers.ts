export const safeDivide = (num: number, denom: number) => {
  if (!denom) return null
  return Number((num / denom).toFixed(2))
}

export const calcStrikeRate = (runs: number, balls: number) => safeDivide(runs * 100, balls)

export const calcAverage = (runs: number, innings: number, notOuts: number) => {
  const outs = Math.max(innings - notOuts, 0)
  return safeDivide(runs, outs)
}

export const calcEconomy = (runsConceded: number, overs: number) =>
  safeDivide(runsConceded, overs)
