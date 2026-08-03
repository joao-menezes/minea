import { LoaderCircle } from "lucide-react"

export function LoadSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <LoaderCircle className="text-primary h-16 w-16 animate-spin" />
    </div>
  )
}
