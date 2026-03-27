"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { ModeToggle } from "./ui/mode-toggle"

const TITLE_BY_ROUTE: Record<string, string> = {
  dashboard: "Dashboard",
  learn: "Learn",
  portfolio: "Portfolio",
  leaderboard: "Leaderboard",
  "ai-assistant": "AI Assistant",
}

export function SiteHeader() {
  const pathname = usePathname()

  const firstSegment = pathname.split("/").filter(Boolean)[0]

  const pageTitle =
    pathname === "/"
      ? "Home"
      : TITLE_BY_ROUTE[firstSegment] ??
        firstSegment
          ?.split("-")
          .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
          .join(" ") ??
        "Home"

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <section className="flex w-full items-center justify-between px-4 lg:gap-2 lg:px-6">
        <div className="flex w-full items-center gap-1">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-8"
          />
          <h1 className="text-base font-medium">{pageTitle}</h1>
        </div>
        <ModeToggle />
      </section>
    </header>
  )
}
