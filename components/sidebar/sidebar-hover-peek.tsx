"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"

import { useSidebar } from "./sidebar"
import { cn } from "@/lib/utils"

interface SidebarHoverPeekProps {
  children: React.ReactNode
  className?: string
}

const dockEase = [0.22, 1, 0.36, 1] as const

export function SidebarHoverPeek({ children, className }: SidebarHoverPeekProps) {
  const {
    open,
    isMobile,
    dockFromPeek,
    endDockFromPeek,
    setPeekPanelOpen,
    beginSidebarLayoutAnimation,
    endSidebarLayoutAnimation,
  } = useSidebar()
  const reduceMotion = useReducedMotion()
  const [peek, setPeek] = React.useState(false)
  const closeTimerRef = React.useRef<number | null>(null)
  const dockCompleteRef = React.useRef(false)

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

  React.useEffect(() => {
    if (!dockFromPeek) dockCompleteRef.current = false
  }, [dockFromPeek])

  if (isMobile) return null
  if (open && !dockFromPeek) return null

  const docking = open && dockFromPeek
  const showFloatingPanel = peek || docking

  const floatTransition = reduceMotion
    ? { duration: 0 }
    : { type: "tween" as const, duration: 0.18, ease: [0.16, 1, 0.3, 1] as const }

  const dockTransition = reduceMotion
    ? { duration: 0 }
    : { type: "tween" as const, duration: 0.22, ease: dockEase }

  const transition = docking ? dockTransition : floatTransition

  return (
    <>
      {!open && (
        <div
          aria-hidden
          className="pointer-events-auto fixed top-0 bottom-0 left-0 z-40 w-4 cursor-default max-md:hidden"
          onPointerEnter={handleActivate}
          onPointerLeave={scheduleClose}
        />
      )}
      <motion.div
        role="complementary"
        aria-label={docking ? "Docking sidebar" : "Sidebar preview"}
        aria-hidden={!showFloatingPanel}
        className={cn(
          "fixed z-45 flex max-h-[calc(100vh-1rem)] max-md:hidden flex-col overflow-hidden border border-black/10 bg-[#CEC7D4] will-change-transform",
          docking
            ? "shadow-none"
            : "top-2 bottom-2 rounded-xl shadow-[0_12px_40px_rgba(68,55,80,0.28)]",
          className,
        )}
        style={{
          width: "var(--sidebar-width)",
          pointerEvents: showFloatingPanel || docking ? "auto" : "none",
        }}
        initial={false}
        animate={
          docking
            ? {
                left: 0,
                top: 0,
                bottom: 0,
                x: 0,
                opacity: 1,
                borderRadius: 0,
                boxShadow: "none",
              }
            : {
                left: "0.5rem",
                top: "0.5rem",
                bottom: "0.5rem",
                x: peek ? 0 : "calc(-100% - 0.5rem)",
                opacity: peek ? 1 : 0,
                borderRadius: 12,
                boxShadow: "0 12px 40px rgba(68,55,80,0.28)",
              }
        }
        transition={transition}
        onPointerEnter={handleActivate}
        onPointerLeave={scheduleClose}
        onAnimationStart={beginSidebarLayoutAnimation}
        onAnimationComplete={() => {
          endSidebarLayoutAnimation()
          if (!open || !dockFromPeek || dockCompleteRef.current) return
          dockCompleteRef.current = true
          endDockFromPeek()
        }}
      >
        {children}
      </motion.div>
    </>
  )
}
