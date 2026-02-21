export const toOvers = (balls: number) => {
  const overs = Math.floor(balls / 6)
  const rem = balls % 6
  return `${overs}.${rem}`
}

export const strikeRate = (runs: number, balls: number) =>
  balls === 0 ? 0 : Number(((runs / balls) * 100).toFixed(2))

export const economyRate = (runs: number, balls: number) =>
  balls === 0 ? 0 : Number(((runs / balls) * 6).toFixed(2))
