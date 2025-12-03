"use client"

import { cn } from "@/lib/utils"
import { useEffect } from "react"

interface GradientBorderProps {
  children: React.ReactNode
  className?: string
}

// CSS for the rotating border effect
const gradientBorderStyles = `
@property --border-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

@keyframes border-rotate {
  to {
    --border-angle: 360deg;
  }
}

.gradient-border-card {
  --border-angle: 0deg;
  background: 
    linear-gradient(45deg, #080b11, #1e293b 50%, #172033) padding-box,
    conic-gradient(
      from var(--border-angle),
      rgba(71, 85, 105, 0.48) 80%,
      #8b5cf6 86%,
      #a78bfa 90%,
      #06b6d4 94%,
      rgba(71, 85, 105, 0.48)
    ) border-box;
  border: 2px solid transparent;
  animation: border-rotate 4s linear infinite;
}
`

let stylesInjected = false

export function GradientBorder({
  children,
  className,
}: GradientBorderProps) {
  useEffect(() => {
    if (!stylesInjected) {
      const styleElement = document.createElement("style")
      styleElement.textContent = gradientBorderStyles
      document.head.appendChild(styleElement)
      stylesInjected = true
    }
  }, [])

  return (
    <div
      className={cn(
        "gradient-border-card rounded-2xl",
        className
      )}
    >
      {children}
    </div>
  )
}
