"use client"

import { motion, useReducedMotion } from "motion/react"

import { useSidebar } from "@/components/sidebar"
import { cn } from "@/lib/utils"

const dockEase = [0.22, 1, 0.36, 1] as const

interface HomePageFrameProps {
  className?: string
}

export function HomePageFrame({ className }: HomePageFrameProps) {
  const { open, isMobile } = useSidebar()
  const reduceMotion = useReducedMotion()

  /** Keep timing stable while `dockFromPeek` toggles off so scale does not re-interpolate at the same value. */
  const transition = reduceMotion
    ? { duration: 0 }
    : open && !isMobile
      ? { duration: 0.22, ease: dockEase }
      : { duration: 0.12, ease: "linear" as const }

  const scale = open && !isMobile ? 0.985 : 1

  return (
    <motion.div
      data-slot="page-frame"
      className={cn(
        "size-full rounded-lg bg-white shadow-[0_1px_6px_rgba(68,55,80,0.22)]",
        className,
      )}
      initial={false}
      animate={{ scale }}
      transition={transition}
      style={{ transformOrigin: "62% 50%" }}
    />
  )
}
