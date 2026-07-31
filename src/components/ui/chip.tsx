// components/ui/chip.tsx

import { cn } from "@/lib/utils"

type ChipProps = React.HTMLAttributes<HTMLDivElement>

export function Chip({ className, ...props }: ChipProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        className,
      )}
      {...props}
    />
  )
}
