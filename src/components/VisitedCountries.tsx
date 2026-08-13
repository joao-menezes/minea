import { Divider } from "@/components/Divider"
import { Country } from "@/lib/types"

export function VisitedCountries({
  visibleCountries,
  totalCountries,
}: {
  visibleCountries: Country[]
  totalCountries: number
}) {
  return (
    <section className="px-4 pb-6">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[9px] font-black tracking-[0.18em] text-[#8291A1] uppercase">
          Países visitados
        </span>
        <span className="h-px w-12 bg-[#D8D1C1]" />
      </div>
      <div className="border border-[#D8D1C1] bg-white p-4">
        {visibleCountries.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-2">
              {visibleCountries.map((country) => (
                <div
                  key={country.code}
                  className="inline-flex items-center gap-1.5 border border-[#D8D1C1] bg-[#F7F3E8] px-2.5 py-1.5"
                >
                  <span
                    className={`fi fi-${country.code.toLowerCase()} shrink-0`}
                    aria-hidden="true"
                  />

                  <span className="min-w-0 truncate text-[9px] font-black text-[#102A43]">
                    {country.name}
                  </span>

                  <span className="shrink-0 text-[8px] font-bold text-[#8291A1]">
                    {country.reports}
                  </span>
                </div>
              ))}
            </div>
            {visibleCountries.length < totalCountries && (
              <>
                <Divider className="my-3" />

                <p className="text-[8px] leading-4 text-[#B1AFA8]">
                  Alguns países estão ocultos pelas suas preferências de
                  privacidade.
                </p>
              </>
            )}
          </>
        ) : (
          <div className="flex min-h-[52px] items-center justify-center">
            <p className="text-[10px] font-bold text-[#B1AFA8]">
              Nenhum país visível publicamente
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
