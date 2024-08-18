import { ReactNode } from "react"

const HStack: React.FC<{
  gap: "sm" | "md" | "lg"
  children: ReactNode
  className?: string
}> = ({ children, gap, className }) => {
  const gapLength = gap === "sm" ? 2 : gap === "md" ? 4 : 8
  return (
    <div className={`flex items-center gap-${gapLength} ${className}`}>
      {children}
    </div>
  )
}

export { HStack }
