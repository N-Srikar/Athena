"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Set default theme to light
  useEffect(() => {
    if (!theme) {
      setTheme("light")
    }
  }, [theme, setTheme])

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Use resolvedTheme to determine the actual theme (accounting for system preference)
  const currentTheme = resolvedTheme || theme

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className={`rounded-full ${className}`}
      aria-label="Toggle theme"
    >
      {currentTheme === "dark" ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
    </Button>
  )
}
