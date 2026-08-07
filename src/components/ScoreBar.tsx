import { DollarSign, Star, MapPin, Package, Check } from "lucide-react"

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
    label: "Price",
    description: "Value for money",
    icon: DollarSign,
  },
  {
    key: "quality",
    label: "Quality",
    description: "Product quality",
    icon: Star,
  },
  {
    key: "distance",
    label: "Distance",
    description: "How close it is",
    icon: MapPin,
  },
  {
    key: "availability",
    label: "Availability",
    description: "Likely in stock",
    icon: Package,
  },
] satisfies {
  key: keyof Scores
  label: string
  description: string
  icon: React.ElementType
}[]

function getScoreState(value: number) {
  if (value >= 80) {
    return {
      label: "Excellent",
      text: "text-[#467566]",
      bg: "bg-[#DDECE5]",
      bar: "bg-[#6B9080]",
    }
  }

  if (value >= 50) {
    return {
      label: "Average",
      text: "text-[#80651D]",
      bg: "bg-[#FFF1D0]",
      bar: "bg-[#F4C95D]",
    }
  }

  return {
    label: "Low",
    text: "text-[#C9563D]",
    bg: "bg-[#FFF1ED]",
    bar: "bg-[#E76F51]",
  }
}

function normalize(value: number) {
  return Math.min(100, Math.max(0, value ?? 0))
}

export default function ScoreBar({ scores }: Props) {
  return (
    <section className="border border-[#D8D1C1] bg-white">
      <div className="border-b border-[#E8E2D5] px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[9px] font-black tracking-[0.2em] text-[#8291A1] uppercase">
              Travel score
            </span>

            <h3 className="mt-1 text-base font-black text-[#102A43]">
              Is it worth the trip?
            </h3>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DDECE5] text-[#467566]">
            <Check className="h-4 w-4" />
          </div>
        </div>

        <p className="mt-2 max-w-sm text-xs leading-5 text-[#8291A1]">
          A quick look at price, distance, quality and availability.
        </p>
      </div>

      <div className="divide-y divide-[#E8E2D5]">
        {LABELS.map(({ key, label, description, icon: Icon }) => {
          const value = normalize(scores[key])
          const state = getScoreState(value)

          return (
            <div key={key} className="px-5 py-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center ${state.bg} ${state.text} `}
                >
                  <Icon size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-black text-[#102A43]">
                        {label}
                      </p>

                      <p className="mt-0.5 text-[10px] text-[#8291A1]">
                        {description}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span
                        className={`block text-sm font-black ${state.text} `}
                      >
                        {value}%
                      </span>

                      <span
                        className={`text-[8px] font-black tracking-wider uppercase ${state.text} `}
                      >
                        {state.label}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden bg-[#F0ECE2]">
                    <div
                      className={`h-full transition-[width] duration-700 ease-out ${state.bar} `}
                      style={{
                        width: `${value}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="border-t border-[#E8E2D5] bg-[#F7F3E8] px-5 py-3">
        <p className="text-[9px] font-bold tracking-wider text-[#8291A1] uppercase">
          Local - V1 recommendation
        </p>
      </div>
    </section>
  )
}
