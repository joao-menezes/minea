"use client"

import {
  Clock3,
  History,
  MapPin,
  Navigation,
  Star,
  TrendingDown,
  X,
} from "lucide-react"

type InfoSheetProps = {
  open: boolean
  onClose: () => void
  title?: string
}

export default function InfoSheet({
  open,
  onClose,
  title = "More information",
}: InfoSheetProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end bg-[#102A43]/35 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <section
        className="animate-in slide-in-from-bottom relative max-h-[85vh] w-full overflow-y-auto border-t border-[#D8D1C1] bg-[#F7F3E8] shadow-[0_-8px_30px_rgba(16,42,67,0.18)] duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3">
          <div className="h-1 w-10 bg-[#C8C0AF]" />
        </div>

        <header className="flex items-start justify-between gap-4 px-5 pt-4 pb-5">
          <div className="min-w-0">
            <span className="block text-[9px] font-black tracking-[0.2em] text-[#8291A1] uppercase">
              LocalV1
            </span>

            <h2 className="mt-1 truncate text-xl font-black tracking-tight text-[#102A43]">
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#D8D1C1] bg-white text-[#102A43] transition-all hover:border-[#102A43] active:translate-y-0.5"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="border-y border-[#E8E2D5] bg-white px-5 py-4">
          <div className="grid grid-cols-3 gap-3">
            <InfoItem
              icon={TrendingDown}
              label="Price"
              value="Good"
              accent="green"
            />

            <InfoItem
              icon={MapPin}
              label="Distance"
              value="450 m"
              accent="blue"
            />

            <InfoItem icon={Star} label="Rating" value="4.6" accent="yellow" />
          </div>
        </div>
        <div className="px-5 py-5">
          <InfoSection icon={MapPin} title="Location">
            <p className="text-sm leading-5 text-[#596A79]">
              Market location and address information will appear here.
            </p>
          </InfoSection>

          <InfoSection icon={History} title="Price history">
            <div className="border border-[#D8D1C1] bg-white p-4">
              <div className="flex items-end justify-between">
                <div>
                  <span className="block text-[9px] font-black tracking-wider text-[#8291A1] uppercase">
                    Current
                  </span>

                  <strong className="mt-1 block text-lg font-black text-[#102A43]">
                    R$ 28,99
                  </strong>
                </div>

                <div className="text-right">
                  <span className="block text-[9px] font-black tracking-wider text-[#8291A1] uppercase">
                    Lowest
                  </span>

                  <strong className="mt-1 block text-lg font-black text-[#6B9080]">
                    R$ 26,90
                  </strong>
                </div>
              </div>

              <div className="mt-5 flex h-16 items-end gap-1">
                {[45, 62, 52, 78, 65, 58, 42, 50, 38, 44].map(
                  (height, index) => (
                    <div
                      key={index}
                      className="flex-1 bg-[#DDECE5]"
                      style={{
                        height: `${height}%`,
                      }}
                    />
                  ),
                )}
              </div>

              <div className="mt-2 flex justify-between text-[8px] font-bold tracking-wider text-[#9AA5AE] uppercase">
                <span>Older</span>
                <span>Now</span>
              </div>
            </div>
          </InfoSection>

          <InfoSection icon={Clock3} title="Availability">
            <div className="flex items-center gap-3 border border-[#D8D1C1] bg-white p-4">
              <div className="h-2.5 w-2.5 bg-[#6B9080]" />

              <div>
                <p className="text-xs font-black text-[#102A43]">
                  Likely available
                </p>

                <p className="mt-0.5 text-[10px] text-[#8291A1]">
                  Last reported recently
                </p>
              </div>
            </div>
          </InfoSection>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 border border-[#D8D1C1] bg-white py-3 text-xs font-black tracking-wider text-[#102A43] uppercase transition-all hover:border-[#102A43]"
            >
              <MapPin size={14} />
              View map
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-2 bg-[#102A43] py-3 text-xs font-black tracking-wider text-white uppercase transition-all hover:bg-[#183B59]"
            >
              <Navigation size={14} />
              Directions
            </button>
          </div>

          <p className="mt-5 text-center text-[9px] leading-4 text-[#9AA5AE]">
            Price and availability information may change.
          </p>
        </div>
      </section>
    </div>
  )
}

/* =========================================================
   INFO ITEM
========================================================= */

function InfoItem({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType
  label: string
  value: string
  accent: "green" | "blue" | "yellow"
}) {
  const accents = {
    green: "bg-[#DDECE5] text-[#467566]",
    blue: "bg-[#E2EAF1] text-[#385A73]",
    yellow: "bg-[#FFF1D0] text-[#80651D]",
  }

  return (
    <div className="text-center">
      <div
        className={`mx-auto flex h-9 w-9 items-center justify-center ${accents[accent]} `}
      >
        <Icon size={15} />
      </div>

      <span className="mt-2 block text-[8px] font-black tracking-wider text-[#8291A1] uppercase">
        {label}
      </span>

      <strong className="mt-0.5 block text-xs font-black text-[#102A43]">
        {value}
      </strong>
    </div>
  )
}

/* =========================================================
   INFO SECTION
========================================================= */

function InfoSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-5">
      <div className="mb-3 flex items-center gap-2">
        <Icon size={14} className="text-[#6B9080]" />

        <h3 className="text-xs font-black tracking-wider text-[#102A43] uppercase">
          {title}
        </h3>
      </div>

      {children}
    </section>
  )
}
