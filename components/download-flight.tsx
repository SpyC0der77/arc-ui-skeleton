"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { FileText, Gift } from "lucide-react";

export type Point = { x: number; y: number };
export type Flight = { id: string; name: string; origin: Point; target: Point; showGift: boolean };

/** Ballistic file animation shared by the web demo and the Zen theme. */
export function FileFlight({ flight, onLand }: { flight: Flight; onLand: (id: string) => void }) {
  const reduceMotion = useReducedMotion()
  const duration = reduceMotion ? 0 : 1.6
  const path = React.useMemo(() => {
    const { origin: a, target: b } = flight
    const lift = Math.min(240, Math.max(130, Math.abs(b.x - a.x) * .28))
    const apex = Math.min(Math.min(a.y, b.y) - 1, Math.max(24, Math.min(a.y, b.y) - lift))
    // Solve a ballistic arc through both endpoints with an upward launch.
    // Horizontal velocity stays constant; gravity accelerates the descent.
    const rise = Math.sqrt(Math.max(0, a.y - apex))
    const fall = Math.sqrt(Math.max(0, b.y - apex))
    const gravity = (rise + fall) ** 2
    const launch = -2 * rise * (rise + fall)
    return Array.from({ length: 65 }, (_, index) => {
      const t = index / 64
      return {
        x: a.x + (b.x - a.x) * t - 18,
        y: a.y + launch * t + gravity * t * t - 22,
      }
    })
  }, [flight])

  return <>
    {flight.showGift && <motion.div className="fallback-gift" style={{ position: "absolute", width: 20, height: 20, color: "#65556f", left: flight.target.x - 10, top: flight.target.y - 10 }} initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0], y: [0, 0, -3, 0] }} transition={{ opacity: { duration, times: [0, .08, .92, 1] }, y: { duration, times: [0, .85, .91, 1] } }}><Gift size={20} strokeWidth={1.8} /></motion.div>}
    <motion.div className="file-flight" style={{ position: "absolute", left: 0, top: 0, width: 36, height: 44, display: "grid", placeItems: "center", color: "#65556f", filter: "drop-shadow(0 2px 3px #44375030)", willChange: "transform, opacity" }} data-flight-id={flight.id} data-target-x={flight.target.x} data-target-y={flight.target.y}
      initial={{ x: flight.origin.x - 18, y: flight.origin.y - 22, opacity: 0, scale: 1, rotate: -8 }}
      animate={reduceMotion ? { opacity: 0 } : {
        x: path.map((point) => point.x), y: path.map((point) => point.y),
        scale: [1, 1.08, 1, .12], rotate: [-8, -26, 14, 0], opacity: [0, 1, 1, 0],
      }}
      transition={{ duration, ease: 'linear',
        x: { duration, ease: 'linear' }, y: { duration, ease: 'linear' },
        scale: { duration, times: [0, .12, .9, 1] }, rotate: { duration, times: [0, .3, .85, 1] }, opacity: { duration, times: [0, .05, .96, 1] },
      }}
      onAnimationComplete={() => onLand(flight.id)}
    ><FileText size={36} strokeWidth={1.4} fill="white" /></motion.div>
  </>
}
