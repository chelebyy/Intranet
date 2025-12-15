"use client"

import { useEffect, useState, useCallback, useId } from "react"
import { cn } from "@/lib/utils"

interface EncryptedTextProps {
  text: string
  className?: string
  revealDelayMs?: number
  charset?: string
  flipDelayMs?: number
  encryptedClassName?: string
  revealedClassName?: string
}

// Helper function to generate display character
function getCharForDisplay(
  index: number,
  text: string,
  revealedIndices: Set<number>,
  getRandomChar: () => string
): string {
  if (revealedIndices.has(index)) {
    return text[index]
  }
  if (text[index] === " ") {
    return " "
  }
  return getRandomChar()
}

export function EncryptedText({
  text,
  className,
  revealDelayMs = 50,
  charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[];:,.<>/?",
  flipDelayMs = 50,
  encryptedClassName,
  revealedClassName,
}: Readonly<EncryptedTextProps>) {
  const [displayText, setDisplayText] = useState<string[]>([])
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set())
  const uniqueId = useId()

  const getRandomChar = useCallback(() => {
    return charset[Math.floor(Math.random() * charset.length)]
  }, [charset])

  // Initialize with random characters (preserve spaces)
  useEffect(() => {
    setDisplayText(text.split("").map((char) => char === " " ? " " : getRandomChar()))
    setRevealedIndices(new Set())
  }, [text, getRandomChar])

  // Flip random characters continuously for unrevealed positions
  // Stop when all characters are revealed
  useEffect(() => {
    // If all characters revealed, don't run interval
    if (revealedIndices.size >= text.length) {
      setDisplayText(text.split(""))
      return
    }

    // Create character mapper function outside of setDisplayText to reduce nesting
    const mapCharacter = (_: string, index: number) =>
      getCharForDisplay(index, text, revealedIndices, getRandomChar)

    const updateChars = () => {
      setDisplayText((prev) => prev.map(mapCharacter))
    }

    const interval = setInterval(updateChars, flipDelayMs)

    return () => clearInterval(interval)
  }, [text, revealedIndices, flipDelayMs, getRandomChar])

  // Reveal characters one by one
  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = []

    // Reveal each character with increasing delay
    for (let i = 0; i < text.length; i++) {
      const timeout = setTimeout(() => {
        setRevealedIndices((prev) => new Set([...prev, i]))
      }, 100 + i * revealDelayMs)
      timeouts.push(timeout)
    }

    return () => {
      timeouts.forEach((t) => clearTimeout(t))
    }
  }, [text, revealDelayMs])

  return (
    <span className={cn("font-mono", className)}>
      {displayText.map((char, index) => (
        <span
          key={`${uniqueId}-char-${index}`}
          className={cn(
            "inline-block transition-all duration-100",
            revealedIndices.has(index) ? revealedClassName : encryptedClassName
          )}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  )
}
