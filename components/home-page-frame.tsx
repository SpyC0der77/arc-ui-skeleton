"use client";

import { motion, useTransform } from "motion/react";

import { useSidebar } from "@/components/sidebar";
import { cn } from "@/lib/utils";

/** Half the docked scale shrink (vs 0.985) so the inset beside the sidebar matches halved main-side padding. */
const DOCKED_PAGE_SCALE = 1 - (1 - 0.985) / 2;

interface HomePageFrameProps {
  className?: string;
}

export function HomePageFrame({ className }: HomePageFrameProps) {
  const { dockProgress, isMobile } = useSidebar();
  const paddingY = useTransform(dockProgress, (p) => isMobile ? 6 : p * 10);
  const paddingRight = useTransform(dockProgress, (p) => isMobile ? 6 : p * 10);
  const scale = useTransform(dockProgress, (p) => isMobile ? 1 : 1 - p * (1 - DOCKED_PAGE_SCALE));
  const borderRadius = useTransform(dockProgress, (p) => isMobile ? 10 : p * 10);
  const boxShadow = useTransform(dockProgress, (p) =>
    `0 1px 6px rgba(68,55,80,${0.22 * (isMobile ? 1 : p)})`,
  );

  return (
    <motion.div
      className="flex min-h-0 flex-1 flex-col"
      style={{ paddingTop: paddingY, paddingBottom: paddingY, paddingRight, paddingLeft: isMobile ? 3 : 0 }}
    >
      <motion.div
        data-slot="page-frame"
        className={cn("min-h-0 flex-1 bg-white", className)}
        style={{ scale, borderRadius, boxShadow, transformOrigin: "62% 50%" }}
      />
    </motion.div>
  );
}
