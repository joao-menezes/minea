import { DollarSign, Star, MapPin, Package } from "lucide-react"

type Scores = {
  price: number
  quality: number
  distance: number
  availability: number
}

type Props = {
  scores: Scores
}

const LABELS = [
  {
    key: "price",
    label: "Preço",
    icon: DollarSign,
  },
  {
    key: "quality",
    label: "Qualidade",
    icon: Star,
  },
  {
    key: "distance",
    label: "Distância",
    icon: MapPin,
  },
  {
    key: "availability",
    label: "Estoque",
    icon: Package,
  },
] satisfies {
  key: keyof Scores
  label: string
  icon: React.ElementType
}[]

function barColor(value: number) {
  if (value >= 80) return "from-green-400 to-green-600"
  if (value >= 50) return "from-yellow-400 to-yellow-500"
  return "from-red-400 to-red-600"
}

export default function ScoreBar({ scores }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {LABELS.map(({ key, label, icon: Icon }) => {
        const value = Math.min(100, Math.max(0, scores[key] ?? 0))

        return (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-secondary flex h-8 w-8 items-center justify-center rounded-xl">
                  <Icon size={16} />
                </span>

                <span className="text-sm font-medium">{label}</span>
              </div>

              <span className="bg-primary/10 text-primary rounded-full px-2.5 py-1 text-xs font-bold">
                {value}%
              </span>
            </div>

            <div className="bg-secondary h-2.5 overflow-hidden rounded-full">
              <div
                className={`h-full rounded-full bg-gradient-to-r transition-[width] duration-700 ease-out ${barColor(value)}`}
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
