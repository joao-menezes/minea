export function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

type StringKeys<T> = {
  [K in keyof T]-?: T[K] extends string ? K : never
}[keyof T]

type SearchOptions<T> = {
  fields: readonly StringKeys<T>[]
  aliases?: (item: T) => readonly string[]
}

export function searchAndRank<T>(
  items: readonly T[],
  query: string,
  options: SearchOptions<T>,
): T[] {
  const normalizedQuery = normalizeSearch(query)

  if (!normalizedQuery) {
    return [...items]
  }

  const terms = normalizedQuery.split(/\s+/).filter(Boolean)

  return items
    .map((item) => {
      const values = options.fields
        .map((field) => item[field])
        .map((value) => normalizeSearch(String(value)))

      const aliases = options.aliases?.(item) ?? []

      const searchableValues = [...values, ...aliases.map(normalizeSearch)]

      let score = 0

      for (const term of terms) {
        let bestScore = 0

        for (const value of searchableValues) {
          if (value === term) {
            bestScore = Math.max(bestScore, 100)
            continue
          }

          if (value.startsWith(term)) {
            bestScore = Math.max(bestScore, 70)
            continue
          }

          if (value.includes(term)) {
            bestScore = Math.max(bestScore, 40)
          }
        }

        score += bestScore
      }

      return {
        item,
        score,
      }
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((result) => result.item)
}
