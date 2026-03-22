"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ChevronRight,
  Github,
  Globe,
  Home,
  Info,
  Search,
} from "lucide-react"
import { CommandInput as CmdkInput } from "cmdk"

import {
  Command,
  CommandDialog,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"

interface ArcUrlCommandContextValue {
  openUrlCommand: () => void
}

const ArcUrlCommandContext =
  React.createContext<ArcUrlCommandContextValue | null>(null)

export function useArcUrlCommand(): ArcUrlCommandContextValue {
  const ctx = React.useContext(ArcUrlCommandContext)
  if (!ctx)
    throw new Error(
      "useArcUrlCommand must be used within ArcUrlCommandProvider",
    )
  return ctx
}

function resolveNavigation(
  raw: string,
): { kind: "internal"; path: string } | { kind: "external"; href: string } | null {
  const trimmed = raw.trim()
  if (!trimmed) return null

  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    const path = trimmed.split("#")[0] ?? "/"
    return { kind: "internal", path: path || "/" }
  }

  let candidate = trimmed
  if (!/^https?:\/\//i.test(candidate)) {
    if (
      /\s/.test(candidate) ||
      (!candidate.includes(".") && !/^localhost(?::\d+)?\b/i.test(candidate))
    ) {
      return {
        kind: "external",
        href: `https://www.google.com/search?q=${encodeURIComponent(candidate)}`,
      }
    }
    candidate = `https://${candidate.replace(/^\/+/, "")}`
  }

  try {
    const u = new URL(candidate)
    if (u.protocol === "http:" || u.protocol === "https:")
      return { kind: "external", href: u.href }
  } catch {
    /* fall through */
  }
  return {
    kind: "external",
    href: `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`,
  }
}

const arcItemClass =
  "mb-0.5 gap-2.5 rounded-lg border border-transparent px-3 py-1.5 text-sm leading-snug shadow-none " +
  "data-[selected=true]:border-transparent data-[selected=true]:bg-[#9494ff] data-[selected=true]:text-white " +
  "[&>svg:last-child]:hidden"

const arcTrailingClass =
  "ml-auto flex shrink-0 items-center gap-2 pl-2 text-xs font-medium text-[#999] " +
  "group-data-[selected=true]/command-item:text-white/90"

const arcArrowWrapClass =
  "flex size-6 items-center justify-center rounded-md bg-black/5 text-[#aaa] " +
  "group-data-[selected=true]/command-item:bg-white group-data-[selected=true]/command-item:text-[#9494ff]"

function ArcTabRowTrail() {
  return (
    <div className={arcTrailingClass}>
      <span className="hidden sm:inline">Switch to Tab</span>
      <span className={arcArrowWrapClass}>
        <ChevronRight className="size-3.5" strokeWidth={2.25} aria-hidden />
      </span>
    </div>
  )
}

function ArcFaviconTile({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-md bg-white text-[#333] shadow-[0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-black/6",
        "group-data-[selected=true]/command-item:ring-white/40",
      )}
    >
      {children}
    </span>
  )
}

interface QuickLink {
  id: string
  label: string
  keywords: string
  icon: React.ReactNode
  nav: ReturnType<typeof resolveNavigation>
}

const QUICK_LINKS: QuickLink[] = [
  {
    id: "home",
    label: "Home",
    keywords: "home start",
    icon: <Home className="size-4" strokeWidth={2} />,
    nav: { kind: "internal", path: "/" },
  },
  {
    id: "repo",
    label: "arc-ui-skeleton on GitHub",
    keywords: "github repo source",
    icon: <Github className="size-4" strokeWidth={2} />,
    nav: {
      kind: "external",
      href: "https://github.com/SpyC0der77/arc-ui-skeleton",
    },
  },
  {
    id: "vercel",
    label: "arc-ui-skeleton.vercel.app",
    keywords: "vercel deploy production",
    icon: <Globe className="size-4" strokeWidth={2} />,
    nav: { kind: "external", href: "https://arc-ui-skeleton.vercel.app" },
  },
]

interface ArcUrlCommandProviderProps {
  children: React.ReactNode
}

interface ArcCommandSearchRowProps {
  navigateFromInput: (raw: string) => void
}

function ArcCommandSearchRow({ navigateFromInput }: ArcCommandSearchRowProps) {
  return (
    <div className="flex items-center gap-3 border-b border-black/8 px-5 py-3">
      <Search
        className="size-[18px] shrink-0 text-[#999]"
        strokeWidth={2}
        aria-hidden
      />
      <CmdkInput
        placeholder="Search or Enter URL..."
        aria-label="Search or enter URL"
        className={cn(
          "min-w-0 flex-1 border-0 bg-transparent text-sm text-[#333] outline-none",
          "placeholder:text-[#999]",
        )}
        onKeyDown={(e) => {
          if (e.key !== "Enter" || e.nativeEvent.isComposing) return
          const raw = e.currentTarget.value.trim()
          if (raw === "") return
          e.preventDefault()
          e.stopPropagation()
          navigateFromInput(raw)
        }}
      />
      <button
        type="button"
        className="flex size-7 shrink-0 items-center justify-center rounded-full text-[#999] transition-colors hover:bg-black/6 hover:text-[#666]"
        aria-label="About this palette"
      >
        <Info className="size-[18px]" strokeWidth={2} aria-hidden />
      </button>
    </div>
  )
}

export function ArcUrlCommandProvider({ children }: ArcUrlCommandProviderProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [dialogKey, setDialogKey] = React.useState(0)

  const openUrlCommand = React.useCallback(() => {
    setDialogKey((k) => k + 1)
    setOpen(true)
  }, [])

  const navigateFromInput = React.useCallback(
    (raw: string) => {
      const target = resolveNavigation(raw)
      if (!target) return
      setOpen(false)
      if (target.kind === "internal") router.push(target.path)
      else window.location.assign(target.href)
    },
    [router],
  )

  const applyQuickLink = React.useCallback(
    (link: QuickLink) => {
      if (!link.nav) return
      setOpen(false)
      if (link.nav.kind === "internal") router.push(link.nav.path)
      else window.location.assign(link.nav.href)
    },
    [router],
  )

  const value = React.useMemo(
    () => ({ openUrlCommand }),
    [openUrlCommand],
  )

  return (
    <ArcUrlCommandContext.Provider value={value}>
      {children}
      <CommandDialog
        key={dialogKey}
        open={open}
        onOpenChange={setOpen}
        title="Search or enter URL"
        description="Type a URL, search query, or choose an open tab."
        showCloseButton={false}
        className={cn(
          "top-[34%] max-w-[calc(100%-2rem)] translate-y-0 gap-0 rounded-2xl! border border-black/7 bg-[#f5f5f5] p-0 text-[#333] shadow-[0_12px_48px_rgba(0,0,0,0.14)] ring-0 sm:max-w-2xl",
        )}
      >
        <Command
          shouldFilter={false}
          loop
          label="Search or enter URL"
          className="rounded-none! border-0 bg-transparent p-0 font-sans text-[#333]"
        >
          <ArcCommandSearchRow navigateFromInput={navigateFromInput} />
          <CommandList className="max-h-[min(280px,50vh)] scroll-py-1 px-2 pb-2 pt-1.5">
            <CommandGroup
              heading="Open tabs"
              className={cn(
                "p-0 text-[#333]",
                "**:[[cmdk-group-heading]]:px-4 **:[[cmdk-group-heading]]:pb-1.5 **:[[cmdk-group-heading]]:pt-2 **:[[cmdk-group-heading]]:text-[11px] **:[[cmdk-group-heading]]:font-semibold **:[[cmdk-group-heading]]:uppercase **:[[cmdk-group-heading]]:tracking-[0.08em] **:[[cmdk-group-heading]]:text-[#999]",
                "**:[[cmdk-group-items]]:px-1 **:[[cmdk-group-items]]:pb-0 **:[[cmdk-group-items]]:pt-0",
              )}
            >
              {QUICK_LINKS.map((link) => (
                <CommandItem
                  key={link.id}
                  value={`${link.id} ${link.keywords}`}
                  keywords={link.keywords.split(" ")}
                  onSelect={() => applyQuickLink(link)}
                  className={arcItemClass}
                >
                  <ArcFaviconTile>{link.icon}</ArcFaviconTile>
                  <span className="min-w-0 flex-1 truncate font-medium">
                    {link.label}
                  </span>
                  <ArcTabRowTrail />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </ArcUrlCommandContext.Provider>
  )
}
