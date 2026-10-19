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
  const { dockProgress, dockFromPeek, sidebarWidthPx, isMobile } = useSidebar();
  const paddingY = useTransform(dockProgress, (p) => isMobile ? 6 : p * 10);
  const paddingRight = useTransform(dockProgress, (p) => isMobile ? 6 : p * 10);
  const scale = useTransform(dockProgress, (p) => isMobile ? 1 : 1 - p * (1 - DOCKED_PAGE_SCALE));
  const borderRadius = useTransform(dockProgress, (p) => isMobile ? 10 : p * 10);
  const boxShadow = useTransform(dockProgress, (p) =>
    `0 1px 6px rgba(68,55,80,${0.22 * (isMobile ? 1 : p)})`,
  );
  // While docking, the page's layout edge travels underneath the preview.
  // Round the exposed edge beside the preview instead of hiding the rounding
  // behind it until the handoff. Keep the scale's inset beside that edge too,
  // so it arrives at the final page position without reversing direction.
  const clipPath = useTransform(dockProgress, (p) => {
    const pageScale = 1 - p * (1 - DOCKED_PAGE_SCALE);
    const coveredWidth = (sidebarWidthPx + 8) * (1 - p);
    return `inset(0px 0px 0px ${coveredWidth / pageScale}px round ${p * 10}px)`;
  });

  return (
    <motion.div
      className="flex min-h-0 flex-1 flex-col"
      style={{ paddingTop: paddingY, paddingBottom: paddingY, paddingRight, paddingLeft: isMobile ? 3 : 0 }}
    >
      <motion.div
        data-slot="page-frame"
        className={cn("min-h-0 flex-1 bg-white", className)}
        style={{
          scale,
          borderRadius,
          boxShadow,
          transformOrigin: "62% 50%",
          // Keep the exposed rounded edge above the floating preview.
          zIndex: dockFromPeek && !isMobile ? 46 : undefined,
          position: "relative",
          clipPath: dockFromPeek && !isMobile ? clipPath : "none",
        }}
      />
    </motion.div>
  );
}
