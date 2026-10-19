"use client"

import { useSidebar } from "./sidebar"

/** Reveals the existing desktop sidebar instead of mounting a second panel. */
export function SidebarHoverPeek() {
  const { open, isMobile, leftRailWidthPx, activatePeek, schedulePeekClose } = useSidebar()
  if (open || isMobile) return null

  return (
    <div
      aria-hidden
      data-slot="sidebar-peek-trigger"
      className="pointer-events-auto fixed top-0 bottom-0 z-40 w-4 cursor-default max-md:hidden"
      style={{ left: leftRailWidthPx }}
      onPointerEnter={activatePeek}
      onPointerLeave={schedulePeekClose}
    />
  )
}
