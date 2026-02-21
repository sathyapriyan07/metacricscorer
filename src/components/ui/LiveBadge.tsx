const LiveBadge = ({ label = 'Live' }: { label?: string }) => (
  <span className="live-pulse inline-flex items-center rounded-full bg-live-500/20 px-3 py-1 text-xs uppercase tracking-widest text-live-500">
    {label}
  </span>
)

export default LiveBadge
