import React, { useEffect } from "react"
import { cn } from "@/lib/utils"

interface AnimatedShinyButtonProps {
  children: React.ReactNode
  className?: string
  type?: "button" | "submit" | "reset"
  disabled?: boolean
  onClick?: () => void
}

const shinyButtonStyles = `
.shiny-cta {
  --shiny-cta-bg: #000000;
  --shiny-cta-bg-subtle: #1a1818;
  --shiny-cta-fg: #ffffff;
  --shiny-cta-highlight: #a855f7;
  --shiny-cta-highlight-subtle: #9333ea;
  --gradient-angle: 0deg;
  --gradient-angle-offset: 0deg;
  --gradient-percent: 5%;
  --gradient-shine: white;
  --duration: 3s;
  --shadow-size: 2px;
  --transition: 800ms cubic-bezier(0.25, 1, 0.5, 1);

  isolation: isolate;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  outline-offset: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  line-height: 1.2;
  font-weight: 500;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  color: var(--shiny-cta-fg);
  background:
    linear-gradient(var(--shiny-cta-bg), var(--shiny-cta-bg)) padding-box,
    conic-gradient(
      from calc(var(--gradient-angle) - var(--gradient-angle-offset)),
      transparent,
      var(--shiny-cta-highlight) var(--gradient-percent),
      var(--gradient-shine) calc(var(--gradient-percent) * 2),
      var(--shiny-cta-highlight) calc(var(--gradient-percent) * 3),
      transparent calc(var(--gradient-percent) * 4)
    ) border-box;
  box-shadow: inset 0 0 0 1px var(--shiny-cta-bg-subtle);
  transition: var(--transition);
  transition-property: --gradient-angle-offset, --gradient-percent, --gradient-shine;
  animation: gradient-angle 3s linear infinite;
}

.shiny-cta:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.shiny-cta::before {
  content: "";
  pointer-events: none;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
  --size: calc(100% - var(--shadow-size) * 3);
  --position: 2px;
  --space: calc(var(--position) * 2);
  width: var(--size);
  height: var(--size);
  background: radial-gradient(
    circle at var(--position) var(--position),
    white calc(var(--position) / 4),
    transparent 0
  ) padding-box;
  background-size: var(--space) var(--space);
  background-repeat: space;
  mask-image: conic-gradient(
    from calc(var(--gradient-angle) + 45deg),
    black,
    transparent 10% 90%,
    black
  );
  border-radius: 0.5rem;
  opacity: 0.4;
  animation: gradient-angle 3s linear infinite;
}

.shiny-cta::after {
  content: "";
  pointer-events: none;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
  width: 100%;
  aspect-ratio: 1;
  background: linear-gradient(
    -50deg,
    transparent,
    var(--shiny-cta-highlight),
    transparent
  );
  mask-image: radial-gradient(circle at bottom, transparent 40%, black);
  opacity: 0.6;
  animation: shimmer 3s linear infinite;
}

.shiny-cta:active {
  transform: translateY(1px);
}

.shiny-cta:hover,
.shiny-cta:focus-visible {
  --gradient-percent: 20%;
  --gradient-angle-offset: 95deg;
  --gradient-shine: var(--shiny-cta-highlight-subtle);
}

@keyframes gradient-angle {
  to {
    --gradient-angle: 360deg;
  }
}

@keyframes shimmer {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@property --gradient-angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}
`

let stylesInjected = false

export function AnimatedShinyButton({
  children,
  className = "",
  type = "button",
  disabled = false,
  onClick,
}: AnimatedShinyButtonProps) {
  useEffect(() => {
    if (!stylesInjected) {
      const styleElement = document.createElement("style")
      styleElement.textContent = shinyButtonStyles
      document.head.appendChild(styleElement)
      stylesInjected = true
    }
  }, [])

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn("shiny-cta", className)}
    >
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
    </button>
  )
}
