"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark")

  useEffect(() => {
    const stored = localStorage.getItem("theme")
    if (stored) {
      setTheme(stored)
      document.documentElement.classList.toggle("dark", stored === "dark")
    }
  }, [])

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark"
    setTheme(next)
    localStorage.setItem("theme", next)
    document.documentElement.classList.toggle("dark", next === "dark")
  }

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg bg-muted hover:scale-105 transition"
    >
      {theme === "dark" ? <Sun size={18}/> : <Moon size={18}/>}
    </button>
  )
}