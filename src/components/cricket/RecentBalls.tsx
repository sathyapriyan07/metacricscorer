interface RecentBallsProps {
  balls: string[]
}

const colorForBall = (ball: string) => {
  if (ball === 'W') return 'bg-red-500/80'
  if (ball === '6') return 'bg-emerald-500/80'
  if (ball === '4') return 'bg-blue-500/80'
  return 'bg-white/10'
}

const RecentBalls = ({ balls }: RecentBallsProps) => (
  <div className="flex gap-2">
    {balls.map((ball, index) => (
      <div
        key={`${ball}-${index}`}
        className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${colorForBall(
          ball,
        )}`}
      >
        {ball}
      </div>
    ))}
  </div>
)

export default RecentBalls
