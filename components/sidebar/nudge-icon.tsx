"use client"

import * as React from "react"
import {
  motion,
  useAnimationControls,
  useReducedMotion,
  type TargetAndTransition,
  type Transition,
} from "motion/react"

import { cn } from "@/lib/utils"

const REST = { x: 0, y: 0, rotate: 0, scale: 1 } as const

/**
 * One characterful press motion per icon role — nudge out, then spring home.
 * Keep these small; they’re feedback, not decoration.
 */
const PRESETS = {
  back: { x: -4 },
  forward: { x: 4 },
  reload: { rotate: -50 },
  panel: { x: -3 },
  lock: { rotate: -14 },
  plus: { rotate: 90 },
  shapes: { rotate: 18, scale: 1.08 },
  github: { y: -2, scale: 1.08 },
  gift: { y: -3, rotate: -12 },
  close: { rotate: 90 },
  archive: { y: 2, scale: 0.9 },
  film: { x: 3 },
  file: { y: -2 },
  image: { scale: 1.14 },
  music: { rotate: -18 },
} satisfies Record<string, TargetAndTransition>

export type IconNudgePreset = keyof typeof PRESETS

const OUT: Transition = { duration: 0.18, ease: "easeOut" }
const BACK: Transition = {
  type: "spring",
  stiffness: 280,
  damping: 18,
  mass: 0.7,
}

export interface NudgeIconHandle {
  play: () => void
}

interface NudgeIconProps {
  preset: IconNudgePreset
  className?: string
  children: React.ReactNode
  disabled?: boolean
}

export const NudgeIcon = React.forwardRef<NudgeIconHandle, NudgeIconProps>(
  function NudgeIcon({ preset, className, children, disabled = false }, ref) {
    const controls = useAnimationControls()
    const reduceMotion = useReducedMotion()
    const playingRef = React.useRef(false)

    const play = React.useCallback(() => {
      if (disabled || reduceMotion || playingRef.current) return
      playingRef.current = true
      void (async () => {
        try {
          await controls.start({ ...PRESETS[preset], transition: OUT })
          await controls.start({ ...REST, transition: BACK })
        } finally {
          playingRef.current = false
        }
      })()
    }, [controls, disabled, preset, reduceMotion])

    React.useImperativeHandle(ref, () => ({ play }), [play])

    return (
      <motion.span
        className={cn(
          "inline-flex origin-center will-change-transform",
          className,
        )}
        initial={REST}
        animate={controls}
      >
        {children}
      </motion.span>
    )
  },
)

/** Fire a nudge from a parent control’s pointerdown (covers button padding). */
export function playNudgeOnPress<E extends { button: number }>(
  handle: React.RefObject<NudgeIconHandle | null>,
  onPointerDown?: (event: E) => void,
) {
  return (event: E) => {
    if (event.button === 0) handle.current?.play()
    onPointerDown?.(event)
  }
}
