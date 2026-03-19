"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

const themes = [
  { name: "Zinc", value: "zinc" },
  { name: "Blue", value: "blue" },
  { name: "Rose", value: "rose" },
  { name: "Orange", value: "orange" },
]

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme()
  const [colorTheme, setColorTheme] = React.useState("zinc")
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("color-theme") || "zinc"
    setColorTheme(saved)
    document.documentElement.setAttribute("data-theme", saved)
  }, [])

  if (!mounted) return null;

  const handleColorChange = (value: string) => {
    setColorTheme(value)
    localStorage.setItem("color-theme", value)
    document.documentElement.setAttribute("data-theme", value)
  }

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Appearance</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {themes.map((t) => (
          <Button
            key={t.value}
            variant={colorTheme === t.value ? "default" : "outline"}
            size="sm"
            className="h-8 text-xs justify-start"
            onClick={() => handleColorChange(t.value)}
          >
            <div className="w-2 h-2 rounded-full mr-2 bg-primary" />
            {t.name}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <Button
          variant={theme === "light" ? "default" : "outline"}
          size="sm"
          className="flex-1 h-8 text-xs"
          onClick={() => setTheme("light")}
        >
          <Sun className="h-3 w-3 mr-2" />
          Light
        </Button>
        <Button
          variant={theme === "dark" ? "default" : "outline"}
          size="sm"
          className="flex-1 h-8 text-xs"
          onClick={() => setTheme("dark")}
        >
          <Moon className="h-3 w-3 mr-2" />
          Dark
        </Button>
      </div>
    </div>
  )
}
