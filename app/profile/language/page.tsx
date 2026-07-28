import Link from "next/link"

export default function LanguagePage() {
  const languages = [
    "Português (Brasil)",
    "English (United States)",
    "Español",
    "Français",
    "Deutsch",
    "Italiano",
    "日本語",
    "中文",
  ]

  return (
    <main className="bg-background min-h-screen p-4">
      <Link href="/profile" className="text-primary mb-4 block text-sm">
        ← Voltar
      </Link>

      <h1 className="mb-6 text-2xl font-bold">Idioma</h1>

      <div className="bg-card overflow-hidden rounded-2xl border">
        {languages.map((language) => (
          <button
            key={language}
            className="hover:bg-muted flex w-full items-center justify-between border-b px-4 py-4 text-left last:border-none"
          >
            <span>{language}</span>
            <span className="text-muted-foreground">→</span>
          </button>
        ))}
      </div>
    </main>
  )
}
