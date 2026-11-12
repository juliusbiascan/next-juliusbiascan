"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

import { useSite } from "../api/site"
import type { SiteData } from "../services/get-site"
import { isActive } from "../utils/is-active"

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Toggle color theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {mounted && resolvedTheme === "dark" ? <Sun /> : <Moon />}
    </Button>
  )
}

function NavLinks({
  navigation,
  className,
}: {
  navigation: SiteData["navigation"]
  className?: string
}) {
  const pathname = usePathname()

  return (
    <>
      {navigation.map((item) => {
        const active = isActive(pathname, item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center text-sm transition-colors",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
              className
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </>
  )
}

export function SiteHeader() {
  const { data } = useSite()
  if (!data) return null

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md">
      <div className="mx-auto w-full max-w-5xl border-x">
        <div className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className="px-4 text-sm font-medium tracking-tight sm:px-6"
          >
            {data.name}
          </Link>
          <div className="flex h-full items-stretch">
            <nav className="hidden h-full sm:flex">
              <NavLinks navigation={data.navigation} className="h-full border-l px-4" />
            </nav>
            <div className="flex items-center border-l px-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
        <nav className="grid grid-cols-4 border-t sm:hidden">
          <NavLinks
            navigation={data.navigation}
            className="h-11 justify-center border-l px-2 first:border-l-0"
          />
        </nav>
      </div>
    </header>
  )
}
