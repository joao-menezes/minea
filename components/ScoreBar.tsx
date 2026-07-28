type Scores = {
  price: number
  quality: number
  distance: number
  availability: number
}

type Props = {
  scores: Scores
}

const LABELS: { key: keyof Scores; label: string; emoji: string }[] = [
  { key: "price", label: "Preço", emoji: "💰" },
  { key: "quality", label: "Qualidade", emoji: "⭐" },
  { key: "distance", label: "Distância", emoji: "📍" },
  { key: "availability", label: "Estoque", emoji: "📦" },
]

function barColor(value: number) {
  if (value >= 80) return "from-green-400 to-green-600"
  if (value >= 50) return "from-yellow-400 to-yellow-500"
  return "from-red-400 to-red-600"
}

export default function ScoreBar({ scores }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {LABELS.map(({ key, label, emoji }) => {
        const value = Math.min(100, Math.max(0, scores[key]))

        return (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-secondary flex h-8 w-8 items-center justify-center rounded-xl text-sm">
                  {emoji}
                </span>

                <span className="text-sm font-medium">{label}</span>
              </div>

              <span className="bg-primary/10 text-primary rounded-full px-2.5 py-1 text-xs font-bold">
                {value}%
              </span>
            </div>

            <div className="bg-secondary h-2.5 overflow-hidden rounded-full">
              <div
                className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ${barColor(value)} `}
                style={{
                  width: `${value}%`,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
