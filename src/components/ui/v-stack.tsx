import { ReactNode } from "react"

const VStack: React.FC<{
  gap: "sm" | "md" | "lg"
  children: ReactNode
  className?: string
}> = ({ children, gap, className }) => {
  const gapLength = gap === "sm" ? 2 : gap === "md" ? 4 : 8
  return (
    <div className={`flex flex-col gap-${gapLength} ${className}`}>
      {children}
    </div>
  )
}

export { VStack }
