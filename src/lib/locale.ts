import "server-only"

import { cookies } from "next/headers"

export async function setLocale(locale: string) {
  const cookieStore = await cookies()

  cookieStore.set("NEXT_LOCALE", locale, {
    maxAge: 31536000,
    path: "/",
  })
}
