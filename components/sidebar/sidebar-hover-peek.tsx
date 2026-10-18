"use client"

import * as React from "react"
import { motion, useReducedMotion, useTransform } from "motion/react"

import { useSidebar } from "./sidebar"
import { cn } from "@/lib/utils"

interface SidebarHoverPeekProps {
  children: React.ReactNode
  className?: string
}

export function SidebarHoverPeek({ children, className }: SidebarHoverPeekProps) {
  const {
    open,
    isMobile,
    dockFromPeek,
    dockProgress,
    setPeekPanelOpen,
    beginSidebarLayoutAnimation,
    endSidebarLayoutAnimation,
    leftRailWidthPx,
  } = useSidebar()
  const reduceMotion = useReducedMotion()
  const [peek, setPeek] = React.useState(false)
  const closeTimerRef = React.useRef<number | null>(null)
  const panelInset = useTransform(dockProgress, [0, 1], [8, 0])
  const panelLeft = useTransform(dockProgress, (p) => leftRailWidthPx + 8 * (1 - p))
  const borderRadius = useTransform(dockProgress, [0, 1], [12, 0])
  const boxShadow = useTransform(dockProgress, (p) =>
    `inset 0 0 0 1px rgba(0,0,0,${0.1 * (1 - p)}), 0 ${12 * (1 - p)}px ${40 * (1 - p)}px rgba(68,55,80,${0.28 * (1 - p)})`,
  )

  const cancelClose = React.useCallback(() => {
    if (closeTimerRef.current != null) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const scheduleClose = React.useCallback(() => {
    if (open || dockFromPeek) return
    cancelClose()
    closeTimerRef.current = window.setTimeout(() => {
      setPeek(false)
      closeTimerRef.current = null
    }, 200)
  }, [cancelClose, dockFromPeek, open])

  const handleActivate = React.useCallback(() => {
    cancelClose()
    setPeek(true)
  }, [cancelClose])

  React.useEffect(() => {
    return () => cancelClose()
  }, [cancelClose])

  React.useEffect(() => {
    setPeekPanelOpen(peek)
  }, [peek, setPeekPanelOpen])

  React.useEffect(() => {
    return () => setPeekPanelOpen(false)
  }, [setPeekPanelOpen])

  React.useEffect(() => {
    if (open && !dockFromPeek) setPeek(false)
  }, [open, dockFromPeek])

  if (isMobile) return null
  if (open && !dockFromPeek) return null

  const docking = open && dockFromPeek
  const showFloatingPanel = peek || docking

  const floatTransition = reduceMotion
    ? { duration: 0 }
    : { type: "tween" as const, duration: 0.18, ease: [0.16, 1, 0.3, 1] as const }

  return (
    <>
      {!open && (
        <div
          aria-hidden
          className="pointer-events-auto fixed top-0 bottom-0 z-40 w-4 cursor-default max-md:hidden"
          style={{ left: leftRailWidthPx }}
          onPointerEnter={handleActivate}
          onPointerLeave={scheduleClose}
        />
      )}
      <motion.div
        role="complementary"
        aria-label={docking ? "Docking sidebar" : "Sidebar preview"}
        aria-hidden={!showFloatingPanel}
        className={cn(
          "fixed z-45 flex max-md:hidden flex-col overflow-hidden bg-[#CEC7D4]",
          className,
        )}
        style={{
          width: "var(--sidebar-width)",
          left: panelLeft,
          top: panelInset,
          bottom: panelInset,
          borderRadius,
          boxShadow,
          pointerEvents: showFloatingPanel || docking ? "auto" : "none",
        }}
        initial={false}
        animate={{
          x: showFloatingPanel ? 0 : "calc(-100% - 0.5rem)",
          opacity: showFloatingPanel ? 1 : 0,
        }}
        transition={floatTransition}
        onPointerEnter={handleActivate}
        onPointerLeave={scheduleClose}
        onAnimationStart={beginSidebarLayoutAnimation}
        onAnimationComplete={endSidebarLayoutAnimation}
      >
        {children}
      </motion.div>
    </>
  )
}
