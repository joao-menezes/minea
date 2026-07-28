"use client"

import { useEffect, useState } from "react"

type Location = {
  latitude: number
  longitude: number
}

export function useUserLocation() {
  const [location, setLocation] = useState<Location | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocalização não suportada")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })

        setLoading(false)
      },

      () => {
        setError("Permissão de localização negada")

        setLoading(false)
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  }, [])

  return {
    location,
    loading,
    error,
  }
}
